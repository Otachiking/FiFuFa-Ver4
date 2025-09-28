import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [topic, setTopic] = useState("");
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const fetchFacts = async () => {
    if (!topic) return alert("Please enter a topic first!");
    setLoading(true);
    setFacts([]);
    try {
      const response = await fetch("http://localhost:5000/api/facts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await response.json();
      let cleanFacts = [];
      if (Array.isArray(data.facts)) cleanFacts = data.facts;
      else if (typeof data.facts === "string") {
        cleanFacts = data.facts
          .split(/\d+\.\s/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }
      setFacts(cleanFacts);
    } catch (error) {
      console.error(error);
      setFacts([
        "🙏 Sorry, we couldn't fetch fun facts right now.",
        "📡 Possible reason: connectivity issue or API credit limit reached.",
        "💡 Please try again in a few minutes!",
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreFacts = async () => {
    if (!topic) return;
    setLoadingMore(true);
    try {
      const response = await fetch("http://localhost:5000/api/facts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, more: true }),
      });
      const data = await response.json();
      let cleanFacts = [];
      if (Array.isArray(data.facts)) cleanFacts = data.facts;
      else if (typeof data.facts === "string") {
        cleanFacts = data.facts
          .split(/\d+\.\s/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }
      setFacts(prev => [...prev, ...cleanFacts]);
    } catch (error) {
      console.error(error);
      setFacts(prev => [...prev, "🙏 Sorry, couldn't fetch more facts."]);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") fetchFacts();
  };

  const floatingElements = Array.from({ length: 8 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-20"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [-20, 20, -20],
        x: [-10, 10, -10],
        opacity: [0.2, 0.5, 0.2],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 2,
      }}
    />
  ));

  const colors = { primary: "#514FC2", yellow: "#FFD93D", white: "#F9F9F9" };

  return (
    <div
      className="min-h-screen min-w-screen relative overflow-hidden font-sans"
      style={{
        background:
          "linear-gradient(135deg, #514FC2 0%, #6366f1 50%, #7c3aed 100%)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10"
          style={{ backgroundColor: colors.yellow }}
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: colors.yellow }}
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      <header className="relative z-10 pt-12 pb-8 text-center px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 text-white tracking-tight"
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
          FiFuFa🖐🏻
          </motion.h1>
          <motion.div
            className="inline-block px-6 py-2 rounded-full text-lg font-semibold"
            style={{
              backgroundColor: colors.yellow,
              color: colors.primary,
              boxShadow: `0 4px 15px ${colors.yellow}4D`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            Five Fun Facts Generator
          </motion.div>
        </motion.div>
      </header>

      <main className="relative z-10 flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-12 pb-8">
        <motion.div
          className="relative w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div
            className="rounded-3xl p-8 shadow-2xl backdrop-blur-sm border border-white border-opacity-10"
            style={{
              backgroundColor: colors.white,
              boxShadow:
                "0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)",
            }}
          >
            <motion.div className="mb-6">
              <label
                className="block text-sm font-semibold mb-3"
                style={{ color: colors.primary }}
              >
                What's on your mind? 🤔
              </label>
              <motion.input
                type="text"
                placeholder="Search ninja, japan, batik, le sserafim, or else.."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full border-2 rounded-2xl p-4 text-lg font-medium transition-all duration-300 focus:ring-0 outline-none placeholder-gray-400"
                style={{
                  borderColor: "#e5e7eb",
                  backgroundColor: "white",
                  color: "#1f2937",
                }}
                whileFocus={{
                  borderColor: colors.primary,
                  scale: 1.02,
                  boxShadow: `0 0 0 4px ${colors.primary}1A`,
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={fetchFacts}
              disabled={loading}
              className="w-full font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 relative overflow-hidden disabled:opacity-70"
              style={{
                backgroundColor: colors.primary,
                color: "white",
                boxShadow: `0 8px 25px ${colors.primary}66`,
              }}
            >
              <motion.div
                className="absolute inset-0 opacity-0"
                style={{ backgroundColor: colors.yellow }}
                whileHover={{ opacity: 0.1 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">
                {loading ? (
                  <motion.div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                    𖦹
                    </motion.div>
                    Generating Magic...
                  </motion.div>
                ) : (
                  "Discover Amazing Facts 🚀"
                )}
              </span>
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {facts.length > 0 && (
            <motion.div
              className="w-[100%] md:w-[95%] xl:w-[60%]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="rounded-3xl p-8 shadow-2xl backdrop-blur-sm border border-white border-opacity-10"
                style={{
                  backgroundColor: colors.white,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
                }}
              >
                <motion.h2
                  className="text-2xl sm:text-2xl md:text-xl font-bold mb-6 text-center"
                  style={{ color: colors.primary }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Amazing Facts about "{topic}"🎉
                </motion.h2>
                <div className="space-y-4">
                  {facts.map((fact, idx) => (
                    <motion.div
                      key={idx}
                      className="group p-5 rounded-2xl transition-all duration-300 hover:shadow-lg border-l-4"
                      style={{
                        backgroundColor: "white",
                        borderLeftColor:
                          idx % 2 === 0 ? colors.primary : colors.yellow,
                      }}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.15 + 0.3 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <div className="flex items-start gap-4">
                        <motion.div
                          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{
                            backgroundColor:
                              idx % 2 === 0 ? colors.primary : colors.yellow,
                            color: idx % 2 === 0 ? "white" : colors.primary,
                          }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: idx * 0.15 + 0.5,
                            type: "spring",
                            stiffness: 200,
                          }}
                        >
                          {idx + 1}
                        </motion.div>
                        <p className="flex-1 text-gray-800 leading-relaxed font-medium text-sm sm:text-base md:text-lg">
                          {fact}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Tombol More - hanya tampil jika facts <= 5 */}
                {facts.length <= 5 && (
                  <motion.div 
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      onClick={fetchMoreFacts}
                      disabled={loadingMore}
                      className="font-bold py-3 px-8 rounded-2xl text-base transition-all duration-300 relative overflow-hidden disabled:opacity-70 border-2"
                      style={{
                        backgroundColor: "transparent",
                        color: colors.primary,
                        borderColor: colors.primary,
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 opacity-0"
                        style={{ backgroundColor: colors.primary }}
                        whileHover={{ opacity: 0.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <span className="relative z-10">
                        {loadingMore ? (
                          <motion.div className="flex items-center justify-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              ⚡
                            </motion.div>
                            Loading More...
                          </motion.div>
                        ) : (
                          "More Facts ✨"
                        )}
                      </span>
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 mt-auto py-8 text-center px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="space-y-3"
        >
          <motion.p
            className="text-white/80 text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Built with 💜 using React, Tailwind & Framer Motion
          </motion.p>
          <motion.div
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
            style={{
              backgroundColor: colors.yellow,
              color: colors.primary,
              boxShadow: `0 4px 15px ${colors.yellow}33`,
            }}
            whileHover={{ scale: 1.1, y: -2 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Created by Muhammad Iqbal Rasyid ⚡
          </motion.div>
        </motion.div>
      </footer>
    </div>
  );
}

export default App;