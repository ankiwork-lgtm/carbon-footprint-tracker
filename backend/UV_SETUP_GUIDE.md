# 🚀 UV Package Manager Setup Guide

This guide explains how to set up the Carbon Footprint Backend using **uv** - an extremely fast Python package installer and resolver written in Rust.

## Why uv?

- ⚡ **10-100x faster** than pip
- 🔒 **Reliable** dependency resolution
- 🎯 **Drop-in replacement** for pip
- 📦 **Modern** Python package management
- 🔄 **Compatible** with existing tools

## Quick Start

### Windows (PowerShell)

```powershell
# Run the automated setup script
.\setup-uv.ps1

# Or manually:
# 1. Install uv
irm https://astral.sh/uv/install.ps1 | iex

# 2. Create virtual environment and install dependencies
uv venv
uv pip install -e .

# 3. Activate virtual environment
.\.venv\Scripts\Activate.ps1
```

### Mac/Linux (Bash)

```bash
# Run the automated setup script
chmod +x setup-uv.sh
./setup-uv.sh

# Or manually:
# 1. Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# 2. Create virtual environment and install dependencies
uv venv
uv pip install -e .

# 3. Activate virtual environment
source .venv/bin/activate
```

## Detailed Setup Steps

### 1. Install uv

#### Windows
```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

#### Mac/Linux
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### Verify Installation
```bash
uv --version
```

### 2. Create Virtual Environment

```bash
cd backend
uv venv
```

This creates a `.venv` directory with Python 3.12 (as specified in `.python-version`).

### 3. Activate Virtual Environment

**Windows PowerShell:**
```powershell
.\.venv\Scripts\Activate.ps1
```

**Windows CMD:**
```cmd
.\.venv\Scripts\activate.bat
```

**Mac/Linux:**
```bash
source .venv/bin/activate
```

### 4. Install Dependencies

**Install production dependencies:**
```bash
uv pip install -e .
```

**Install with dev dependencies:**
```bash
uv pip install -e ".[dev]"
```

## Project Configuration

### pyproject.toml

The project uses `pyproject.toml` for dependency management:

```toml
[project]
name = "carbon-footprint-backend"
version = "1.0.0"
requires-python = ">=3.12"

dependencies = [
    "flask>=3.0.0",
    "flask-cors>=4.0.0",
    # ... other dependencies
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
    "black>=23.12.0",
    # ... dev tools
]
```

### .python-version

Specifies Python version for the project:
```
3.12
```

## Common Commands

### Package Management

```bash
# Install a new package
uv pip install package-name

# Install specific version
uv pip install package-name==1.0.0

# Uninstall package
uv pip uninstall package-name

# List installed packages
uv pip list

# Show package info
uv pip show package-name

# Freeze dependencies
uv pip freeze > requirements.txt
```

### Virtual Environment

```bash
# Create new venv
uv venv

# Create with specific Python version
uv venv --python 3.12

# Remove venv
rm -rf .venv  # Mac/Linux
Remove-Item -Recurse -Force .venv  # Windows
```

### Development Workflow

```bash
# 1. Activate environment
source .venv/bin/activate  # Mac/Linux
.\.venv\Scripts\Activate.ps1  # Windows

# 2. Install dependencies
uv pip install -e ".[dev]"

# 3. Run the app
python app.py

# 4. Run tests (when implemented)
pytest

# 5. Format code
black .

# 6. Lint code
ruff check .
```

## Comparison: uv vs pip

| Feature | uv | pip |
|---------|----|----|
| Speed | ⚡ 10-100x faster | Standard |
| Dependency Resolution | ✅ Advanced | Basic |
| Cache | ✅ Global cache | Per-project |
| Compatibility | ✅ Drop-in replacement | Native |
| Written in | Rust | Python |

### Speed Comparison

```bash
# pip install (typical)
time pip install -r requirements.txt
# ~30-60 seconds

# uv pip install (same packages)
time uv pip install -r requirements.txt
# ~2-5 seconds
```

## Troubleshooting

### uv command not found

**Solution:** Restart your terminal or manually add to PATH:

**Windows:**
```powershell
$env:Path += ";$env:USERPROFILE\.cargo\bin"
```

**Mac/Linux:**
```bash
export PATH="$HOME/.cargo/bin:$PATH"
```

### Permission denied on setup script

**Mac/Linux:**
```bash
chmod +x setup-uv.sh
./setup-uv.sh
```

### Virtual environment activation fails

**Windows PowerShell:**
```powershell
# Enable script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Package installation fails

```bash
# Clear cache and retry
uv cache clean
uv pip install -e .
```

## Migration from pip

If you're migrating from pip:

1. **Keep requirements.txt** (optional, for compatibility)
2. **Add pyproject.toml** (already done)
3. **Use uv pip instead of pip**:
   ```bash
   # Old: pip install package
   # New: uv pip install package
   ```

## CI/CD Integration

### GitHub Actions

```yaml
- name: Set up Python
  uses: actions/setup-python@v4
  with:
    python-version: '3.12'

- name: Install uv
  run: curl -LsSf https://astral.sh/uv/install.sh | sh

- name: Install dependencies
  run: |
    uv venv
    uv pip install -e ".[dev]"
```

### Docker

```dockerfile
FROM python:3.12-slim

# Install uv
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.cargo/bin:$PATH"

# Install dependencies
COPY pyproject.toml .
RUN uv pip install --system -e .
```

## Best Practices

1. **Use pyproject.toml** for dependency management
2. **Commit .python-version** to ensure consistent Python version
3. **Don't commit .venv/** (already in .gitignore)
4. **Use uv pip** instead of pip for faster installs
5. **Keep requirements.txt** for backward compatibility (optional)

## Resources

- [uv Documentation](https://github.com/astral-sh/uv)
- [pyproject.toml Guide](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/)
- [Python Packaging Guide](https://packaging.python.org/)

## Support

For issues with:
- **uv**: https://github.com/astral-sh/uv/issues
- **This project**: See main README.md

---

**Happy coding with uv! ⚡**