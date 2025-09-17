#!/bin/bash

# BMad Method Installation Script
# This script automates the installation of BMad Method in the current directory

echo "Installing BMad Method in: /Users/fredericlambrechts/Code/interview-agent"

# Use expect to handle the interactive prompts with all questions
expect -c "
spawn npx bmad-method install
expect \"Enter the full path to your project directory where BMad should be installed:\"
send \"/Users/fredericlambrechts/Code/interview-agent\r\"
expect \"Select what to install/update\"
send \"\r\"
expect \"Will the PRD (Product Requirements Document) be sharded into multiple files?\"
send \"n\r\"
expect eof
"