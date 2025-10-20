#!/usr/bin/env python3
"""Utility to dump key project files into a Markdown document so an LLM can recreate the project."""

from __future__ import annotations

from pathlib import Path
from typing import Dict

# Files to include in the Markdown dump, relative to the project root.
FILES_TO_DUMP = [
    # Query Library app (Vite React + TS + MUI)
    "query-library-app/package.json",
    "query-library-app/tsconfig.json",
    "query-library-app/vite.config.ts",
    "query-library-app/index.html",
    # App entry
    "query-library-app/src/main.tsx",
    "query-library-app/src/App.tsx",
    "query-library-app/src/index.css",
    # Types and data
    "query-library-app/src/types.ts",
    "query-library-app/src/data/mock.ts",
    # Layout and shared components
    "query-library-app/src/components/Layout/HeaderContext.tsx",
    "query-library-app/src/components/Layout/PageHeader.tsx",
    "query-library-app/src/components/Layout/Sidebar.tsx",
    # Feature components
    "query-library-app/src/components/FolderCard.tsx",
    "query-library-app/src/components/MiniQueryCard.tsx",
    # Pages
    "query-library-app/src/pages/Home.tsx",
    "query-library-app/src/pages/Folders.tsx",
    "query-library-app/src/pages/QueryDetail.tsx",
    "query-library-app/src/pages/SchedulesInbox.tsx",
]

# Map file extensions to syntax-highlighted code fences.
LANGUAGE_BY_SUFFIX: Dict[str, str] = {
    ".css": "css",
    ".html": "html",
    ".js": "javascript",
    ".jsx": "javascript",
    ".json": "json",
    ".md": "markdown",
    ".py": "python",
    ".ts": "typescript",
    ".tsx": "tsx",
}


def resolve_project_root() -> Path:
    """Return the project root (parent directory of this script)."""
    return Path(__file__).resolve().parent.parent


def main() -> None:
    root = resolve_project_root()
    output_path = root / "code_dump.md"

    with output_path.open("w", encoding="utf-8") as output_file:
        output_file.write("# Query Library Code Dump\n\n")

        for relative_path in FILES_TO_DUMP:
            file_path = root / relative_path
            if not file_path.exists():
                print(f"Skipping missing file: {relative_path}")
                continue

            language = LANGUAGE_BY_SUFFIX.get(file_path.suffix.lower(), "")

            output_file.write(f"## `{relative_path}`\n\n")
            fence_open = f"```{language}\n" if language else "```\n"
            output_file.write(fence_open)
            output_file.write(file_path.read_text(encoding="utf-8"))
            output_file.write("\n```\n")
            output_file.write("\n")

    print(f"Wrote {output_path}")


if __name__ == "__main__":
    main()
