#!/usr/bin/env python
"""
Entry point: start the FastAPI retrieval HTTP server.
Usage: python serve.py
       uvicorn app.server:app --host 0.0.0.0 --port 8001 --reload
"""

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app.server:app",
        host="0.0.0.0",
        port=8001,
        reload=False,
        log_level="info",
    )
