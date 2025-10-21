# 📚 User Guide - Baby Pluto Guard

Welcome to Baby Pluto Guard! This guide will help you understand and use all the security monitoring features.

## Table of Contents
- [Getting Started](#getting-started)
- [Dashboard Overview](#dashboard-overview)
- [Security Modules](#security-modules)
  - [Process Monitor](#process-monitor)
  - [Port Scanner](#port-scanner)
  - [Startup Items](#startup-items)
  - [File Integrity](#file-integrity)
  - [Baseline System](#baseline-system)
- [Understanding Risk Levels](#understanding-risk-levels)
- [Best Practices](#best-practices)
- [Educational Resources](#educational-resources)

---

## Getting Started

### First Launch

1. **Start the application** using `run.sh` (Linux) or `run.bat` (Windows)
2. **Open your browser** to http://localhost:5173
3. **Wait for connection** - The app will automatically connect to the backend
4. **Explore the dashboard** - You'll see real-time security metrics

### Interface Navigation

The application has two main areas:

**Sidebar (Left):**
- Dashboard - Overview of your system's security
- Process Monitor - Running processes analysis
- Port Scanner - Network port monitoring
- Startup Items - Boot-time applications
- File Integrity - File change detection
- Baseline - System state comparison
- Reports - Security reports (coming soon)

**Main Area (Right):**
- Current page content
- Real-time data updates every 30 seconds
- Interactive tables and charts

---

## Dashboard Overview

The dashboard provides a quick overview of your system's security posture.

### Security Metrics Cards

#### 🟢 Safe
Low-risk items that pose no immediate threat. Example: Standard Windows/Linux system processes.

#### 🟡 Low Risk
Items that may need attention but aren't urgent. Example: Uncommon but legitimate applications.

#### 🟠 Medium Risk
Items requiring investigation. Example: Unknown processes consuming high resources.

#### 🔴 High Risk
Items requiring immediate attention. Example: Suspicious network connections or unauthorized startup items.

### Activity Timeline
Shows recent security events and changes detected in your system:
- New processes started
- Port connections established
- Startup items added
- File modifications detected

### Charts and Visualizations
- **Process Distribution:** Breakdown of processes by risk level
- **Port Status:** Open ports categorized by type (TCP/UDP)
- **Trend Analysis:** Historical view of security events

---

## Security Modules

### Process Monitor

**What are processes?**  
A process is a program that's currently running on your computer. Every application you open (browser, music player, antivirus) creates one or more processes.

#### Features
- Real-time list of all running processes
- CPU and Memory usage for each process
- Risk assessment based on behavior
- Process details (PID, User, Path)

#### How to Use
1. Navigate to **Process Monitor**
2. Review the list of running processes
3. Look for suspicious indicators:
   - Unknown process names
   - High CPU/Memory usage from unfamiliar programs
   - Processes running from unusual locations (e.g., `C:\Temp\`)

#### Risk Indicators
- **High CPU usage** by unknown processes
- **System-level processes** running from user directories
- **Misspelled system process names** (e.g., "scvhost" instead of "svchost")

#### Educational Note
> **Why monitor processes?**  
> Malware often disguises itself as legitimate processes. By monitoring what's running, you can detect:
> - Cryptocurrency miners using your CPU
> - Keyloggers recording your keystrokes
> - Backdoors allowing remote access
> - Ransomware preparing to encrypt files

### Port Scanner

**What are ports?**  
Ports are like doors on your computer. Each network service (web server, database, email) uses a specific port number to communicate. Port 80 is for HTTP, port 443 for HTTPS, etc.

#### Features
- Lists all open network ports
- Shows which process is using each port
- Identifies local and remote connections
- Risk assessment based on port type

#### How to Use
1. Navigate to **Port Scanner**
2. Review open ports and their associated processes
3. Check for:
   - Unexpected listening ports (servers you didn't start)
   - Connections to unfamiliar remote IPs
   - Services that shouldn't be publicly accessible

#### Common Ports Reference
- **80, 443** - Web servers (HTTP/HTTPS)
- **22** - SSH (secure remote access)
- **3306** - MySQL database
- **5432** - PostgreSQL database
- **8000, 3000, 5173** - Development servers

#### Risk Indicators
- **Unknown processes** listening on network ports
- **High-numbered ports** (>49152) with remote connections
- **Database ports** (3306, 5432) exposed publicly

#### Educational Note
> **Why scan ports?**  
> Open ports are entry points for attackers. By monitoring ports, you can detect:
> - Unauthorized remote desktop connections
> - Backdoor servers waiting for commands
> - Data exfiltration connections
> - Network vulnerabilities that need patching

### Startup Items

**What are startup items?**  
Programs that automatically run when your computer boots up. Some are necessary (antivirus, drivers), others are bloatware or malware.

#### Features
- Lists all programs configured to start at boot
- Shows startup method (Registry, Task Scheduler, systemd)
- Risk assessment based on location and behavior
- Details: Path, User, Command

#### How to Use
1. Navigate to **Startup Items**
2. Review each item carefully
3. Investigate suspicious entries:
   - Unfamiliar program names
   - Items from temporary directories
   - Startup items without clear purpose

#### Risk Indicators
- **Unknown programs** in startup
- **Executables from** `%TEMP%`, `AppData\Local\Temp`, `/tmp`
- **Suspicious names** trying to look legitimate
- **Multiple similar entries** (possible persistence mechanism)

#### Educational Note
> **Why monitor startup?**  
> Malware often adds itself to startup to survive reboots. This technique is called "persistence." By monitoring startup items, you can detect:
> - Malware that re-launches after reboot
> - Unwanted bloatware slowing your boot time
> - Potentially Unwanted Programs (PUPs)
> - Advanced Persistent Threats (APTs)

### File Integrity

**What is file integrity monitoring?**  
Tracking changes to important files on your system. If a file changes unexpectedly, it could indicate tampering or malware.

#### Features
- Monitors critical system files
- Calculates SHA-256 hash for each file
- Detects modifications, additions, deletions
- Tracks file size and modification time

#### How to Use
1. Navigate to **File Integrity**
2. Select directories to monitor
3. Perform initial scan to establish baseline
4. Review changes detected in subsequent scans

#### What to Monitor
**Windows:**
- `C:\Windows\System32\` - Core system files
- `C:\Windows\SysWOW64\` - 32-bit system files
- `C:\Program Files\` - Installed applications

**Linux:**
- `/bin/`, `/sbin/` - System binaries
- `/etc/` - Configuration files
- `/usr/bin/` - User binaries

#### Risk Indicators
- **System files modified** without updates
- **New executables** in system directories
- **Configuration files changed** unexpectedly
- **Hash mismatches** indicating corruption or tampering

#### Educational Note
> **Why monitor file integrity?**  
> Attackers often modify system files to hide their presence or maintain access. File integrity monitoring helps detect:
> - Rootkits modifying system binaries
> - Backdoored applications
> - Configuration tampering
> - Malware injected into legitimate programs

### Baseline System

**What is a baseline?**  
A "snapshot" of your system's normal, healthy state. By comparing your current state to the baseline, you can quickly identify changes that might indicate security issues.

#### Features
- Create multiple baselines
- Compare current system state to baseline
- Identify new/removed processes, ports, startup items
- Risk scoring for detected changes
- Baseline management (activate, delete, compare)

#### How to Use

##### Creating Your First Baseline

1. **Clean your system first:**
   - Close unnecessary applications
   - Stop unused services
   - Remove unwanted startup items

2. **Navigate to Baseline page**

3. **Click "Create New Baseline"**
   - Give it a descriptive name (e.g., "Clean System - Jan 2025")
   - Add notes if needed

4. **System will scan:**
   - All running processes
   - All open ports
   - All startup items
   - Critical files

5. **Baseline saved** - You now have a reference point!

##### Comparing to Baseline

1. **Select a baseline** from the list
2. **Click "Compare with Current System"**
3. **Review results:**
   - **Green (Safe):** No significant changes
   - **Yellow (Low):** Minor changes, likely normal
   - **Orange (Medium):** Notable changes, investigate
   - **Red (High):** Suspicious changes, take action

##### Interpreting Comparison Results

**New Processes:**
- Check if you installed new software recently
- Verify the process is legitimate
- Search the process name online

**New Ports:**
- Identify which process opened the port
- Determine if the connection is expected
- Check remote IP addresses

**New Startup Items:**
- Verify the program is one you installed
- Check the startup item's file path
- Remove if unnecessary

**Modified Files:**
- Check if system updates occurred
- Verify file signatures/certificates
- Investigate unexpected changes

#### Best Practices for Baselines

✅ **Create baselines regularly:**
- After fresh OS install
- After major system updates
- Before/after installing new software
- After security incidents (post-cleanup)

✅ **Name baselines descriptively:**
- Include date: "Baseline 2025-01-15"
- Include context: "After Windows Update"
- Include purpose: "Pre-Production Server"

✅ **Keep multiple baselines:**
- Clean system baseline
- Development environment baseline
- Production environment baseline

❌ **Don't create baselines when:**
- System is infected with malware
- Unnecessary software is running
- During active development (too many changes)

#### Educational Note
> **Why use baselines?**  
> Baselines provide a powerful way to detect "unknown unknowns" - threats you didn't know to look for. This technique is used by enterprise security tools like:
> - Tripwire (file integrity monitoring)
> - OSSEC (host-based intrusion detection)
> - EDR solutions (Endpoint Detection and Response)
>
> By learning to use baselines, you're practicing real-world security monitoring techniques!

---

## Understanding Risk Levels

Baby Pluto Guard uses a four-level risk assessment system:

### 🟢 Safe (Risk: 0-25)
**Definition:** Normal, expected system behavior  
**Action Required:** None  
**Examples:**
- Standard Windows/Linux system processes
- Well-known applications (Chrome, Firefox, Office)
- Legitimate system services

### 🟡 Low Risk (Risk: 26-50)
**Definition:** Slightly unusual but likely harmless  
**Action Required:** Monitor  
**Examples:**
- Uncommon but signed applications
- Development tools and servers
- Background updaters

### 🟠 Medium Risk (Risk: 51-75)
**Definition:** Suspicious behavior requiring investigation  
**Action Required:** Investigate  
**Examples:**
- Unknown processes from user directories
- Unexpected network connections
- Unsigned executables in system folders

### 🔴 High Risk (Risk: 76-100)
**Definition:** Potentially malicious activity  
**Action Required:** Immediate investigation  
**Examples:**
- Processes from TEMP directories
- Suspicious network listeners
- Unauthorized startup modifications
- System file tampering

---

## Best Practices

### Daily Usage

1. **Check Dashboard** - Start your day with a quick overview
2. **Review Alerts** - Investigate any high-risk items
3. **Monitor Trends** - Look for gradual changes over time
4. **Update Baseline** - After major system changes

### Weekly Maintenance

1. **Full System Scan** - Review all modules thoroughly
2. **Baseline Comparison** - Compare to weekly baseline
3. **Cleanup** - Remove unnecessary startup items
4. **Documentation** - Note any significant changes

### Security Hygiene

✅ **Do:**
- Keep software updated
- Use strong passwords
- Review startup items regularly
- Create baselines before major changes
- Investigate unfamiliar processes

❌ **Don't:**
- Ignore high-risk warnings
- Run as administrator/root unless necessary
- Install software from untrusted sources
- Disable security features without understanding risks

### Responding to Threats

If you discover suspicious activity:

1. **Don't panic** - Take time to investigate properly
2. **Document findings** - Screenshot suspicious items
3. **Research** - Search for process names, file hashes online
4. **Isolate if needed** - Disconnect from network if actively compromised
5. **Remove threat** - Use antivirus or manual removal
6. **Verify cleanup** - Compare to clean baseline
7. **Learn** - Understand how the infection occurred

---

## Educational Resources

### Learning Cybersecurity

**Free Courses:**
- [Cybrary](https://www.cybrary.it/) - Free cybersecurity courses
- [TryHackMe](https://tryhackme.com/) - Hands-on security training
- [SANS Cyber Aces](https://www.cyberaces.org/) - Free tutorials

**Recommended Books:**
- "The Art of Intrusion" by Kevin Mitnick
- "Practical Malware Analysis" by Michael Sikorski
- "Blue Team Field Manual" by Alan White

**Certifications:**
- CompTIA Security+ (Entry level)
- CEH (Certified Ethical Hacker)
- OSCP (Offensive Security Certified Professional)

### Understanding System Security

**Processes & Memory:**
- [Process Explorer Tutorial](https://docs.microsoft.com/en-us/sysinternals/downloads/process-explorer)
- Understanding how programs run in memory

**Network Security:**
- [Wireshark Tutorial](https://www.wireshark.org/docs/)
- TCP/IP fundamentals
- Port scanning techniques

**Malware Analysis:**
- [Malware Unicorn](https://malwareunicorn.org/) - Reverse engineering
- [Any.run](https://any.run/) - Interactive malware analysis

### Community Resources

**Forums:**
- [r/cybersecurity](https://reddit.com/r/cybersecurity)
- [Bleeping Computer](https://www.bleepingcomputer.com/)
- [Wilders Security](https://www.wilderssecurity.com/)

**YouTube Channels:**
- NetworkChuck
- John Hammond
- IppSec

---

## Frequently Asked Questions

### Why is my antivirus flagged as high risk?
Some security tools use low-level system access that looks suspicious to automated analysis. Check the digital signature and file path to verify legitimacy.

### Should I be worried about all high-risk items?
Not necessarily. High risk means "investigate," not "definitely malicious." Many legitimate tools trigger warnings due to their behavior.

### How often should I scan my system?
Daily quick checks via the Dashboard, weekly full reviews, and baseline comparisons after major changes.

### Can Baby Pluto Guard replace my antivirus?
No! Baby Pluto Guard is a monitoring and learning tool, not a replacement for dedicated antivirus/EDR solutions.

### Is it safe to use on my main computer?
Yes! Baby Pluto Guard only reads system information; it doesn't modify anything or require elevated privileges (except for some Linux network features).

---

## Getting Help

- 📖 [Installation Guide](INSTALLATION.md)
- 🏗️ [Architecture Documentation](ARCHITECTURE.md)
- 🐛 [Report Issues](https://github.com/YOUR_USERNAME/baby-pluto-guard/issues)
- 💬 [Ask Questions](https://github.com/YOUR_USERNAME/baby-pluto-guard/discussions)

---

**Happy Learning! 🐶🛡️**

Remember: The best security tool is an educated user. Baby Pluto Guard helps you learn by doing!
