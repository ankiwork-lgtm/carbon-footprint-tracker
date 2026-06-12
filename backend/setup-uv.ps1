# Setup script for uv package manager (Windows PowerShell)

Write-Host "🚀 Setting up Carbon Footprint Backend with uv..." -ForegroundColor Green

# Check if uv is installed
$uvInstalled = Get-Command uv -ErrorAction SilentlyContinue

if (-not $uvInstalled) {
    Write-Host "📦 Installing uv..." -ForegroundColor Yellow
    irm https://astral.sh/uv/install.ps1 | iex
    Write-Host "✅ uv installed successfully!" -ForegroundColor Green
    
    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
} else {
    Write-Host "✅ uv is already installed" -ForegroundColor Green
}

# Create virtual environment
Write-Host "🔧 Creating virtual environment..." -ForegroundColor Yellow
uv venv

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
uv pip install -e .

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Activate virtual environment: .\.venv\Scripts\Activate.ps1"
Write-Host "2. Copy .env.example to .env and configure"
Write-Host "3. Run the app: python app.py"
Write-Host ""
Write-Host "To install dev dependencies:" -ForegroundColor Yellow
Write-Host "   uv pip install -e '.[dev]'"

# Made with Bob
