# 🤝 Contributing to Baby Pluto Guard

Thank you for your interest in contributing to Baby Pluto Guard! This document provides guidelines and instructions for contributing to the project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Security Module Guidelines](#security-module-guidelines)

---

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and educational environment for all contributors, regardless of experience level.

### Expected Behavior
- Be respectful and constructive
- Focus on learning and teaching
- Welcome newcomers and help them learn
- Accept constructive criticism gracefully

### Unacceptable Behavior
- Harassment or discriminatory language
- Trolling or insulting comments
- Publishing others' private information
- Any conduct inappropriate in a professional setting

---

## How Can I Contribute?

### 🐛 Reporting Bugs

**Before Submitting:**
- Check if the bug has already been reported
- Verify it's actually a bug and not expected behavior
- Test on a clean installation

**Bug Report Should Include:**
- Operating System (Windows/Linux, version)
- Python version (`python --version`)
- Node.js version (`node --version`)
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Error messages/logs

**Template:**
```markdown
## Bug Description
[Clear description of the bug]

## Environment
- OS: Windows 11 / Ubuntu 22.04
- Python: 3.11.0
- Node.js: 18.16.0

## Steps to Reproduce
1. Navigate to Process Monitor
2. Click on "Sort by CPU"
3. Application crashes

## Expected Behavior
Processes should be sorted by CPU usage

## Actual Behavior
Application crashes with error: [paste error]

## Screenshots
[Attach screenshots if applicable]
```

### 💡 Suggesting Features

**Feature Request Should Include:**
- Clear description of the feature
- Use case - why is this needed?
- Potential implementation approach
- Any security implications
- Educational value for students

**Template:**
```markdown
## Feature Description
[Clear description of the proposed feature]

## Use Case
[Explain why this feature would be valuable]

## Proposed Implementation
[Optional: Technical approach]

## Educational Value
[How does this help students learn cybersecurity?]
```

### 📝 Contributing Code

We welcome pull requests for:
- Bug fixes
- New security scanning modules
- Documentation improvements
- Performance optimizations
- UI/UX enhancements
- Tests

---

## Development Setup

### Prerequisites
- Python 3.8+
- Node.js 18+
- Git

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork:**
```bash
git clone https://github.com/YOUR_USERNAME/baby-pluto-guard.git
cd baby-pluto-guard
```

3. **Add upstream remote:**
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/baby-pluto-guard.git
```

### Install Dependencies

```bash
# Run setup script
./setup.sh  # Linux/macOS
# OR
setup.bat   # Windows
```

### Create a Branch

```bash
git checkout -b feature/your-feature-name
# OR
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests

---

## Coding Standards

### Python (Backend)

**Style Guide:** [PEP 8](https://pep8.org/)

**Code Formatting:**
```bash
# Install black
pip install black

# Format code
black backend/
```

**Linting:**
```bash
# Install flake8
pip install flake8

# Lint code
flake8 backend/
```

**Example:**
```python
# Good
def scan_processes() -> List[ProcessInfo]:
    """
    Scan all running processes on the system.
    
    Returns:
        List of ProcessInfo objects with process details
    """
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'username']):
        try:
            info = proc.info
            processes.append(ProcessInfo(**info))
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    return processes


# Bad (avoid)
def scanProcesses():  # Use snake_case, not camelCase
    procs=[]  # No space around =
    for p in psutil.process_iter():
        procs.append(p)  # No error handling
    return procs  # No type hints
```

**Documentation:**
- Add docstrings to all functions
- Use type hints
- Comment complex logic
- Include usage examples

### TypeScript/React (Frontend)

**Style Guide:** [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

**Code Formatting:**
```bash
# Format with prettier (configured in project)
npm run format
```

**Linting:**
```bash
# Lint with ESLint
npm run lint
```

**Example:**
```typescript
// Good
interface ProcessData {
  pid: number;
  name: string;
  user: string;
  cpuPercent: number;
  memoryMb: number;
  riskLevel: 'safe' | 'low' | 'medium' | 'high';
}

export function ProcessTable({ processes }: { processes: ProcessData[] }) {
  const [sortBy, setSortBy] = useState<keyof ProcessData>('pid');
  
  const sortedProcesses = useMemo(
    () => [...processes].sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1),
    [processes, sortBy]
  );

  return (
    <Table>
      {/* Table implementation */}
    </Table>
  );
}


// Bad (avoid)
export function ProcessTable(props) {  // No type annotations
  const [s, setS] = useState('pid');  // Unclear variable name
  
  let sorted = processes.sort(...);  // Mutating props, no memoization
  
  return <table>...</table>;  // Use UI components, not raw HTML
}
```

**Component Guidelines:**
- Use functional components with hooks
- Add TypeScript interfaces for props
- Use semantic HTML
- Follow accessibility best practices
- Use design system components (shadcn/ui)

### General Guidelines

**Comments:**
```python
# Good: Explain WHY, not WHAT
# Calculate risk based on process location and behavior
# Temp directory executables are high risk indicators
if "\\Temp\\" in process.path:
    risk += 40

# Bad: Obvious comments
# Add 40 to risk
risk += 40
```

**Error Handling:**
```python
# Good
try:
    process_info = proc.info
except psutil.NoSuchProcess:
    logger.warning(f"Process {proc.pid} terminated during scan")
    continue
except psutil.AccessDenied:
    logger.debug(f"Access denied for process {proc.pid}")
    continue

# Bad
try:
    process_info = proc.info
except:  # Don't catch all exceptions
    pass  # Don't silently ignore errors
```

---

## Submitting Changes

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Code is properly documented
- [ ] Tests pass (if applicable)
- [ ] No console errors or warnings
- [ ] Tested on target platforms (Windows/Linux)
- [ ] Updated CHANGELOG.md
- [ ] Updated relevant documentation

### Commit Messages

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(processes): add process tree visualization

Implemented hierarchical process tree showing parent-child
relationships. Uses d3.js for rendering. Helps visualize
process spawning chains, useful for malware analysis.

Closes #123
```

```
fix(ports): handle null remote address correctly

Port scanner crashed when remote_address was None for
LISTEN sockets. Added null check before accessing IP.

Fixes #456
```

### Pull Request Process

1. **Update your fork:**
```bash
git fetch upstream
git merge upstream/main
```

2. **Push your branch:**
```bash
git push origin feature/your-feature-name
```

3. **Create Pull Request** on GitHub

4. **PR Description Template:**
```markdown
## Description
[Clear description of changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tested on Windows
- [ ] Tested on Linux
- [ ] Added unit tests
- [ ] Manual testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests (if applicable)
- [ ] Updated CHANGELOG.md

## Screenshots (if applicable)
[Add screenshots of UI changes]

## Related Issues
Closes #123
```

5. **Respond to Review Feedback:**
   - Address all comments
   - Make requested changes
   - Push updates to the same branch
   - Be open to suggestions

---

## Security Module Guidelines

### Creating a New Security Scanner

If you want to add a new security scanning feature:

#### 1. Backend Module (`backend/security/your_scanner.py`)

```python
"""
Your Scanner Module
Scans [describe what it scans]
"""
import psutil
from typing import List, Dict
from .analyzer import calculate_risk


def scan_your_feature() -> List[Dict]:
    """
    Scan [your feature] on the system.
    
    Returns:
        List of dictionaries containing scan results
    """
    results = []
    
    # Your scanning logic here
    # Example: enumerate system resources
    for item in get_system_items():
        try:
            results.append({
                'id': item.id,
                'name': item.name,
                'status': item.status,
                # Add relevant fields
            })
        except Exception as e:
            print(f"Error scanning {item}: {e}")
            continue
    
    return results


def analyze_your_feature_risk(item: Dict) -> int:
    """
    Analyze risk level for a scanned item.
    
    Args:
        item: Dictionary with scan results
        
    Returns:
        Risk score (0-100)
    """
    risk = 0
    
    # Risk factor 1
    if item.get('suspicious_property'):
        risk += 30
    
    # Risk factor 2
    if item.get('another_indicator'):
        risk += 20
    
    # Add educational comments explaining risk factors
    return min(risk, 100)


def get_risk_level(score: int) -> str:
    """Convert numeric score to risk level"""
    if score < 25:
        return 'safe'
    elif score < 50:
        return 'low'
    elif score < 75:
        return 'medium'
    else:
        return 'high'
```

#### 2. API Endpoint (`backend/main.py`)

```python
from security.your_scanner import scan_your_feature, analyze_your_feature_risk

@app.get("/api/your-feature")
async def get_your_feature():
    """
    GET endpoint for your feature scanner
    Returns analyzed scan results
    """
    try:
        raw_data = scan_your_feature()
        
        analyzed_data = []
        for item in raw_data:
            risk_score = analyze_your_feature_risk(item)
            analyzed_data.append({
                **item,
                'risk_score': risk_score,
                'risk_level': get_risk_level(risk_score)
            })
        
        return {
            'data': analyzed_data,
            'timestamp': datetime.now().isoformat(),
            'total': len(analyzed_data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

#### 3. Frontend Hook (`src/hooks/useSecurityAPI.ts`)

```typescript
export const useYourFeature = () => {
  return useQuery({
    queryKey: ['your-feature'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/your-feature`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    refetchInterval: 30000, // Auto-refresh every 30s
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 min
  });
};
```

#### 4. Frontend Component (`src/components/security/YourFeatureTable.tsx`)

```typescript
import { useYourFeature } from '@/hooks/useSecurityAPI';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function YourFeatureTable() {
  const { data, isLoading, error } = useYourFeature();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Risk</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.status}</TableCell>
            <TableCell>
              <Badge variant={getRiskVariant(item.risk_level)}>
                {item.risk_level}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

#### 5. Documentation

Update:
- `docs/USER_GUIDE.md` - Add section explaining your feature
- `docs/ARCHITECTURE.md` - Document technical details
- `README.md` - Add to feature list
- `CHANGELOG.md` - Record in appropriate version

---

## Getting Help

- 💬 [GitHub Discussions](https://github.com/YOUR_USERNAME/baby-pluto-guard/discussions) - Ask questions
- 🐛 [Issues](https://github.com/YOUR_USERNAME/baby-pluto-guard/issues) - Report bugs or request features
- 📖 [Documentation](../README.md) - Read the docs

---

## Recognition

Contributors will be:
- Added to README.md contributors section
- Mentioned in release notes
- Credited in relevant documentation

---

**Thank you for contributing to Baby Pluto Guard! 🐶🛡️**

Together we're helping students learn cybersecurity!
