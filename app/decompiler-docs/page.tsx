export default function DecompilerDocs() {
    return (
        <div
            style={{
                background: "#050505",
                color: "#fff",
                fontFamily: "'Courier New', Courier, monospace",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    background: "#0d0d0d",
                    border: "1px solid #1a1a1a",
                    borderRadius: "12px",
                    padding: "40px 48px",
                    maxWidth: "560px",
                    width: "90%",
                    boxShadow: "0 0 80px rgba(0,0,0,0.8)",
                }}
            >
                {/* Window bar */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
                </div>

                {/* Terminal label */}
                <div
                    style={{
                        fontSize: "10px",
                        letterSpacing: "0.2em",
                        color: "#333",
                        textTransform: "uppercase",
                        marginBottom: "20px",
                    }}
                >
                    nodepoint — dex-run v1.0 — bash
                </div>

                {/* Command line */}
                <div style={{ fontSize: "13px", color: "#555", marginBottom: "10px" }}>
                    $ dex-run --decompile --target ex5
                </div>
                <div style={{ fontSize: "13px", color: "#555", marginBottom: "10px" }}>&nbsp;</div>

                {/* Error */}
                <div
                    style={{
                        color: "#ff4444",
                        fontSize: "15px",
                        fontWeight: "bold",
                        marginBottom: "8px",
                    }}
                >
                    ❌ dex-run not found on device.
                </div>
                <div style={{ fontSize: "13px", color: "#666", marginBottom: "6px" }}>
                    Cannot locate runtime binary in PATH.
                </div>
                <div style={{ fontSize: "13px", color: "#666", marginBottom: "24px" }}>
                    Execution halted.
                </div>

                {/* Discord hint */}
                <div
                    style={{
                        fontSize: "11px",
                        color: "#444",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                    }}
                >
                    For setup instructions, join our{" "}
                    <span style={{ color: "#5865F2", fontWeight: "bold" }}>Discord</span>{" "}
                    server.
                </div>
            </div>
        </div>
    );
}
