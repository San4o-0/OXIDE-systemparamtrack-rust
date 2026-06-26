use std::{convert::Infallible, time::Duration};

use async_stream::stream;
use axum::{
    response::sse::{Event, KeepAlive, Sse},
    routing::get,
    Json, Router,
};
use futures::stream::Stream;
use tower_http::cors::CorsLayer;

use crate::metrics::Collector;
use crate::models::MetricsSnapshot;

const TICK: Duration = Duration::from_secs(1);

pub fn router() -> Router {
    Router::new()
        .route("/health", get(health))
        .route("/api/metrics", get(snapshot_once))
        .route("/api/stream", get(stream_metrics))
        .layer(CorsLayer::permissive())
}

async fn health() -> &'static str {
    "ok"
}

async fn snapshot_once() -> Json<MetricsSnapshot> {
    let mut collector = Collector::new();
    tokio::time::sleep(Duration::from_millis(250)).await;
    Json(collector.collect())
}

async fn stream_metrics() -> Sse<impl Stream<Item = Result<Event, Infallible>>> {
    let event_stream = stream! {
        let mut collector = Collector::new();
        let mut ticker = tokio::time::interval(TICK);

        loop {
            ticker.tick().await;
            let snapshot = collector.collect();

            match serde_json::to_string(&snapshot) {
                Ok(json) => yield Ok(Event::default().data(json)),
                Err(_) => continue,
            }
        }
    };

    Sse::new(event_stream).keep_alive(KeepAlive::default())
}
