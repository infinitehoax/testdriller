# Bolt's Journal ⚡

## 2025-05-17 - [Initial Profiling]
**Learning:** Disk I/O is a silent killer. Reading 100KB+ JSON files on every request adds unnecessary latency and wear. Connection handshakes for AI services also add up.
**Action:** Implement memory caching for static data and connection pooling for external APIs.
