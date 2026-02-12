"""
MoltyDEX Python SDK
Easy integration for x402 payments and token swapping
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="moltydex",
    version="0.1.0",
    author="MoltyDEX",
    author_email="[email protected]",
    description="Python SDK for MoltyDEX - x402 payments and token swapping",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://www.moltydex.com",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.8",
    install_requires=[
        "requests>=2.31.0",
        "solana>=0.30.0",
        "solders>=0.18.0",
    ],
)
