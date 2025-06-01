#!/bin/bash
# Exit on command errors and treat unset variables as an error
set -euo pipefail

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Directory containing all Dockerfiles
DOCKERFILE_DIR="./dockerfiles"

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Function to run Docker commands with or without sudo as needed
docker_cmd() {
  if command_exists docker; then
    # First try without sudo
    if docker info >/dev/null 2>&1; then
      docker "$@"
    else
      # If that fails, try with sudo
      echo -e "${YELLOW}Attempting to run Docker with sudo privileges...${NC}"
      if command_exists sudo; then
        sudo docker "$@"
      else
        echo -e "${RED}Error: Docker requires elevated privileges but sudo is not available${NC}"
        exit 1
      fi
    fi
  else
    echo -e "${RED}Error: Docker is not installed or not in PATH${NC}"
    exit 1
  fi
}

# Check if Docker is installed and running
check_docker() {
  echo -e "${BLUE}${BOLD}Checking Docker installation...${NC}"
  if ! command_exists docker; then
    echo -e "${RED}Error: Docker is not installed or not in PATH.${NC}"
    echo "Please install Docker and try again."
    exit 1
  fi

  echo "Checking if Docker daemon is running..."
  if ! docker info >/dev/null 2>&1 && ! sudo docker info >/dev/null 2>&1; then
    echo -e "${RED}Error: Docker daemon is not running.${NC}"
    echo "Please start Docker and try again."
    exit 1
  fi
  
  echo -e "${GREEN}Docker is ready!${NC}"
}

# Check if Dockerfiles directory exists
check_dockerfiles() {
  echo -e "${BLUE}${BOLD}Checking Dockerfiles...${NC}"
  if [ ! -d "$DOCKERFILE_DIR" ]; then
    echo -e "${RED}Error: Dockerfiles directory '$DOCKERFILE_DIR' does not exist.${NC}"
    echo "Creating the directory structure..."
    mkdir -p "$DOCKERFILE_DIR"
    
    # Inform user they need to create the Dockerfiles
    echo -e "${YELLOW}Please create the necessary Dockerfiles in $DOCKERFILE_DIR before running this script.${NC}"
    echo "Required files:"
    echo " - $DOCKERFILE_DIR/Dockerfile.node"
    echo " - $DOCKERFILE_DIR/Dockerfile.bun"
    echo " - $DOCKERFILE_DIR/Dockerfile.deno"
    echo " - $DOCKERFILE_DIR/Dockerfile.cloudflare"
    exit 1
  fi
  
  # Check if individual Dockerfiles exist
  local missing_files=0
  for runtime in node bun deno cloudflare; do
    if [ ! -f "$DOCKERFILE_DIR/Dockerfile.$runtime" ]; then
      echo -e "${RED}Missing: $DOCKERFILE_DIR/Dockerfile.$runtime${NC}"
      missing_files=$((missing_files+1))
    else
      echo -e "${GREEN}Found: $DOCKERFILE_DIR/Dockerfile.$runtime${NC}"
    fi
  done
  
  if [ $missing_files -gt 0 ]; then
    echo -e "${RED}Error: $missing_files Dockerfile(s) are missing. Please create them before continuing.${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}All required Dockerfiles are present!${NC}"
}

# Function to test a specific runtime
test_runtime() {
  local runtime=$1
  local dockerfile="$DOCKERFILE_DIR/Dockerfile.$runtime"
  local image_name="flutterwave-$runtime-test"
  
  echo -e "\n${BLUE}${BOLD}====================================${NC}"
  echo -e "${YELLOW}${BOLD}🔶 Testing with $runtime runtime${NC}"
  echo -e "${BLUE}${BOLD}====================================${NC}"
  
  echo "Building Docker image for $runtime..."
  if ! docker_cmd build --network host -t "$image_name" -f "$dockerfile" .; then
    echo -e "${RED}Error: Failed to build Docker image for $runtime${NC}"
    return 1
  fi
  
  # Special handling for Cloudflare tests
  if [ "$runtime" = "cloudflare" ]; then
    echo "Running Cloudflare Worker tests (may take a moment)..."
    if ! docker_cmd run --rm "$image_name"; then
      echo -e "${RED}Error: Cloudflare Worker tests failed${NC}"
      return 1
    fi
    echo -e "${GREEN}✅ Cloudflare Worker test completed successfully${NC}"
  else
    echo "Running tests for $runtime..."
    if ! docker_cmd run --rm "$image_name"; then
      echo -e "${RED}Error: Tests failed for $runtime${NC}"
      return 1
    fi
    echo -e "${GREEN}✅ $runtime test completed successfully${NC}"
  fi
  
  return 0
}

# Print test summary
print_summary() {
  local successes=$1
  local failures=$2
  local total=$((successes + failures))
  
  echo -e "\n${BLUE}${BOLD}====================================${NC}"
  echo -e "${BOLD}           TEST SUMMARY            ${NC}"
  echo -e "${BLUE}${BOLD}====================================${NC}"
  echo -e "Total runtimes tested: $total"
  echo -e "${GREEN}Successful: $successes${NC}"
  echo -e "${RED}Failed: $failures${NC}"
  
  if [ $failures -eq 0 ]; then
    echo -e "\n${GREEN}${BOLD}🎉 All runtime tests completed successfully!${NC}"
    echo -e "${GREEN}This package is compatible with all tested JavaScript runtimes.${NC}"
  else
    echo -e "\n${RED}${BOLD}⚠️ $failures runtime tests failed.${NC}"
    echo -e "${RED}Please check the logs above for more details.${NC}"
  fi
}

# Main execution
main() {
  echo -e "${BOLD}Flutterwave Universal SDK - Runtime Compatibility Tests${NC}"
  echo -e "This script tests the SDK across different JavaScript runtimes\n"
  
  # Initial checks
  check_docker
  check_dockerfiles
  
  # Track results
  local successes=0
  local failures=0
  
  # Test each runtime and track results
  if test_runtime "node"; then
    successes=$((successes+1))
  else
    failures=$((failures+1))
  fi
  
  if test_runtime "bun"; then
    successes=$((successes+1))
  else
    failures=$((failures+1))
  fi
  
  if test_runtime "deno"; then
    successes=$((successes+1))
  else
    failures=$((failures+1))
  fi
  
  if test_runtime "cloudflare"; then
    successes=$((successes+1))
  else
    failures=$((failures+1))
  fi
  
  # Print summary
  print_summary $successes $failures
  
  # Exit with failure if any tests failed
  if [ $failures -gt 0 ]; then
    exit 1
  fi
}

# Run the main function
main "$@"

