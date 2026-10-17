import React from 'react';

export default function DesignSystemShowcase() {
  return (
    <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      
      {/* Header */}
      <div>
        <h1 className="text-heading-1" style={{ margin: '0 0 var(--space-sm) 0' }}>
          🎨 Design System
        </h1>
        <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
          DukaanDost Phase 1 — All tokens, components, and rules
        </p>
      </div>

      {/* Colors */}
      <section>
        <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
          Colours
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
          <ColorSwatch name="Primary" hex="#0B7A4B" bg="var(--color-primary)" textColor="white" />
          <ColorSwatch name="Accent" hex="#F59E0B" bg="var(--color-accent)" textColor="white" />
          <ColorSwatch name="Background" hex="#FAF7F2" bg="#FAF7F2" textColor="#1F2933" />
          <ColorSwatch name="Text" hex="#1F2933" bg="#1F2933" textColor="white" />
          <ColorSwatch name="Secondary" hex="#52606D" bg="#52606D" textColor="white" />
          <ColorSwatch name="Positive" hex="#16A34A" bg="#16A34A" textColor="white" />
          <ColorSwatch name="Warning" hex="#D97706" bg="#D97706" textColor="white" />
          <ColorSwatch name="Problem" hex="#DC2626" bg="#DC2626" textColor="white" />
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
          Typography
        </h2>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div>
            <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>
              Number (36px, 800 weight)
            </p>
            <p className="text-number" style={{ margin: 0 }}>₹1,25,000</p>
          </div>
          <div>
            <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>
              Large Number (40px)
            </p>
            <p className="text-number-lg" style={{ margin: 0 }}>₹8,450</p>
          </div>
          <div>
            <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>
              Heading 1 (32px, 700)
            </p>
            <p className="text-heading-1" style={{ margin: 0 }}>Your Shop Today</p>
          </div>
          <div>
            <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>
              Heading 2 (24px, 600)
            </p>
            <p className="text-heading-2" style={{ margin: 0 }}>Daily Summary</p>
          </div>
          <div>
            <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>
              Heading 3 (20px, 600)
            </p>
            <p className="text-heading-3" style={{ margin: 0 }}>Smart Tip</p>
          </div>
          <div>
            <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>
              Body (18px, 400) — Minimum size
            </p>
            <p className="text-body-lg" style={{ margin: 0 }}>
              Aaj ka din achha raha. Aapne ₹8,450 kamaye.
            </p>
          </div>
          <div>
            <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>
              Body Small (16px)
            </p>
            <p className="text-body-md" style={{ margin: 0 }}>
              Secondary text for labels and descriptions.
            </p>
          </div>
          <div>
            <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>
              Caption (14px) — Smallest allowed
            </p>
            <p className="text-body-sm" style={{ margin: 0 }}>
              Fine print, timestamps, helper text.
            </p>
          </div>
          <div>
            <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>
              Devanagari Support
            </p>
            <p className="text-body-lg" style={{ margin: 0 }}>
              नमस्ते रमेश जी, आज का दिन अच्छा रहा।
            </p>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
          Buttons
        </h2>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <button className="btn-primary">
            <span>✏️</span>
            Add Today's Numbers
          </button>
          <button className="btn-secondary">
            <span>📊</span>
            View Weekly Report
          </button>
          <button className="btn-ghost" style={{ justifyContent: 'center' }}>
            <span>🎤</span>
            Or tell me by voice
          </button>
          <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0, textAlign: 'center' }}>
            All buttons: min 56px height, full width, icon + word
          </p>
        </div>
      </section>

      {/* Cards */}
      <section>
        <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
          Cards
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {/* Standard Card */}
          <div className="card">
            <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-xs) 0' }}>
              Standard Card
            </p>
            <p className="text-body-lg" style={{ margin: 0 }}>
              Soft shadow, rounded corners, gentle border.
            </p>
          </div>

          {/* Accent Card */}
          <div className="card" style={{
            borderLeft: '4px solid var(--color-accent)',
            backgroundColor: 'var(--color-accent-light)',
          }}>
            <p className="text-heading-3" style={{ margin: '0 0 var(--space-xs) 0' }}>
              💡 Smart Tip
            </p>
            <p className="text-body-md" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              Your Maggi stock is running low. Order 100 more today.
            </p>
          </div>

          {/* Positive Card */}
          <div className="card" style={{
            borderLeft: '4px solid var(--color-positive)',
          }}>
            <p className="text-heading-3" style={{ margin: '0 0 var(--space-xs) 0' }}>
              🎉 Good News
            </p>
            <p className="text-body-md" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              This week you earned ₹5,200 more than last week!
            </p>
          </div>

          {/* Warning Card */}
          <div className="card" style={{
            borderLeft: '4px solid var(--color-warning)',
          }}>
            <p className="text-heading-3" style={{ margin: '0 0 var(--space-xs) 0' }}>
              ⚠️ Heads Up
            </p>
            <p className="text-body-md" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              Electricity bill is due in 3 days. Don't forget to pay.
            </p>
          </div>
        </div>
      </section>

      {/* Layout Rules */}
      <section>
        <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
          Layout Rules
        </h2>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <RuleItem emoji="👆" text="One main action per screen, in the thumb zone" />
          <RuleItem emoji="📱" text="Mobile-first. One-hand use. Bottom nav with 4 tabs" />
          <RuleItem emoji="🎯" text="Touch targets: minimum 48px, buttons 56px" />
          <RuleItem emoji="🔤" text="Icon + word on every button. Never icon alone" />
          <RuleItem emoji="📏" text="Generous spacing. No cramped screens" />
          <RuleItem emoji="🌙" text="Dark mode available. Respects system preference" />
          <RuleItem emoji="📡" text="Offline-first. Clear 'no internet' banner, never blank" />
          <RuleItem emoji="🗣️" text="Voice input beats typing. Tap beats typing" />
          <RuleItem emoji="₹" text="Indian number grouping: ₹1,25,000 not 1250000" />
          <RuleItem emoji="😊" text="Tone: respectful younger family member" />
        </div>
      </section>

      {/* Tone Examples */}
      <section>
        <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
          Tone of Writing
        </h2>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <ToneExample bad="Revenue increased by 12% QoQ" good="Aaj kal se 12% zyada bikri hui 👍" />
          <ToneExample bad="Your inventory turnover ratio is suboptimal" good="Maggi kam bach gayi hai. 100 aur mangwa lo" />
          <ToneExample bad="EBITDA margin declining" good="Kharcha badh raha hai. Dekhte hain kahan" />
          <ToneExample bad="You are losing money on credit" good="Udhaar ₹15,000 ho gaya. Kuch logon se maang lo?" />
        </div>
      </section>

      {/* Font Info */}
      <section>
        <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
          Font
        </h2>
        <div className="card">
          <p className="text-body-lg" style={{ margin: '0 0 var(--space-sm) 0' }}>
            <strong>Noto Sans</strong> + <strong>Noto Sans Devanagari</strong>
          </p>
          <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            Clean, highly legible. Supports English and Hindi beautifully. 
            Available on all Android devices via Google Fonts.
          </p>
        </div>
      </section>

      {/* Spacing */}
      <div style={{ height: 'var(--space-2xl)' }} />
    </div>
  );
}

function ColorSwatch({ name, hex, bg, textColor }: { name: string; hex: string; bg: string; textColor: string }) {
  return (
    <div style={{
      backgroundColor: bg,
      color: textColor,
      padding: 'var(--space-md)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
    }}>
      <p style={{ margin: '0 0 4px 0', fontWeight: 600, fontSize: '14px' }}>{name}</p>
      <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>{hex}</p>
    </div>
  );
}

function RuleItem({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
      <span style={{ fontSize: '24px', flexShrink: 0 }}>{emoji}</span>
      <p className="text-body-md" style={{ margin: 0 }}>{text}</p>
    </div>
  );
}

function ToneExample({ bad, good }: { bad: string; good: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-problem)', textDecoration: 'line-through' }}>
        ❌ {bad}
      </p>
      <p style={{ margin: 0, fontSize: '16px', color: 'var(--color-positive)', fontWeight: 500 }}>
        ✅ {good}
      </p>
    </div>
  );
}
