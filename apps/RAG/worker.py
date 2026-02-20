#!/usr/bin/env python
"""
Entry point: start the BullMQ-compatible Redis ingestion worker.
Usage: python worker.py
"""

from app.worker import run_worker

if __name__ == "__main__":
    run_worker()
