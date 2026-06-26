mod metrics;
mod models;
mod routes;

use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    let app = routes::router();

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("🦀 Backend слухає на http://{addr}");
    println!("   SSE-стрім:   http://{addr}/api/stream");
    println!("   Один знімок: http://{addr}/api/metrics");

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("не вдалося відкрити порт 3000");

    axum::serve(listener, app)
        .await
        .expect("сервер аварійно завершився");
}
