path = 'src/pages/Index.tsx'

with open(path, 'r') as f:
    content = f.read()

old = """      {/* Admission Banner */}
      {showBanner && (
        <div className="fixed top-0 left-0 right-0 z-[999] bg-primary text-primary-foreground px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm font-medium flex-1 justify-center">
            <Clock size={16} />
            <span>
              {isClosed
                ? "Admission is now closed. Check back for the next cycle."
                : !admissionStart && !admissionEnd
                ? "Admission will open soon — stay tuned!"
                : isOpen ? "Admission Open — Closes in:" : "Admission opens in:"}
            </span>
            {(admissionStart || admissionEnd) && (
              <span className="font-bold">
                {countdown.days}d {String(countdown.hours).padStart(2,'0')}h {String(countdown.minutes).padStart(2,'0')}m {String(countdown.seconds).padStart(2,'0')}s
              </span>
            )}
            {isOpen && (
              <button onClick={() => setShowAdmission(true)} className="underline font-semibold ml-2">Apply Now</button>
            )}
          </div>
          <button onClick={() => setShowBanner(false)} className="text-primary-foreground/80 hover:text-primary-foreground flex-shrink-0">
            <X size={16} />
          </button>
        </div>
      )}

      <Navbar />"""

new = """      <Navbar />"""

if new in content and old not in content:
    print("Already patched, skipping")
elif old in content:
    content = content.replace(old, new, 1)
    with open(path, 'w') as f:
        f.write(content)
    print("Patched: removed Admission countdown banner")
else:
    print("Pattern not found — check manually")
