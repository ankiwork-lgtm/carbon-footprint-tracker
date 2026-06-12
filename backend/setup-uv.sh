#!/bin/bash
# Setup script for uv package manager

echo "🚀 Setting up Carbon Footprint Backend with uv..."

# Check if uv is installed
if ! command -v uv &> /dev/null
then
    echo "📦 Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    echo "✅ uv installed successfully!"
else
    echo "✅ uv is already installed"
fi

# Create virtual environment
echo "🔧 Creating virtual environment..."
uv venv

# Activate virtual environment (instructions)
echo ""
echo "📝 To activate the virtual environment, run:"
echo "   source .venv/bin/activate"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
uv pip install -e .

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Activate virtual environment: source .venv/bin/activate"
echo "2. Copy .env.example to .env and configure"
echo "3. Run the app: python app.py"

# Made with Bob
