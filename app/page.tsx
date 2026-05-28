"use client";

import { useState, useMemo } from "react";
import Navbar from "./components/Navbar";
import FeaturedCard from "./components/FeaturedCard";
import PropertyCard from "./components/PropertyCard";
import { mockFeaturedProperties, mockProperties } from "./data/mockProperties";

export default function Home() {
  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInputVal, setSearchInputVal] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeTxType, setActiveTxType] = useState<"all" | "sale" | "rent">("all");
  const [visibleCount, setVisibleCount] = useState(4);
  const [showFiltersAlert, setShowFiltersAlert] = useState(false);

  // Categories list matching references
  const categories = [
    { label: "All", value: "all" },
    { label: "House", value: "house" },
    { label: "Apartment", value: "apartment" },
    { label: "Villa", value: "villa" },
    { label: "Penthouse", value: "penthouse" },
  ];

  // Perform filtering using useMemo
  const filteredProperties = useMemo(() => {
    return mockProperties.filter((property) => {
      // Category filter
      if (activeCategory !== "all" && property.category !== activeCategory) {
        return false;
      }
      // Transaction type filter
      if (activeTxType !== "all" && property.type !== activeTxType) {
        return false;
      }
      // Search query filter (matches title, location, category)
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = property.title.toLowerCase().includes(query);
        const matchesLocation = property.location.toLowerCase().includes(query);
        const matchesCategory = property.category.toLowerCase().includes(query);
        return matchesTitle || matchesLocation || matchesCategory;
      }
      return true;
    });
  }, [activeCategory, activeTxType, searchQuery]);

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInputVal);
  };

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark dark:text-white leading-tight">
              Find your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 font-medium text-nordic-dark dark:text-white">sanctuary</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
              </span>
              .
            </h1>

            {/* Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="relative group max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">
                  search
                </span>
              </div>
              <input
                className="block w-full pl-12 pr-32 py-4 rounded-xl border-none bg-white dark:bg-white/5 text-nordic-dark dark:text-white shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white dark:focus:bg-white/10 transition-all text-lg focus:outline-none"
                placeholder="Search by city, neighborhood, or address..."
                type="text"
                value={searchInputVal}
                onChange={(e) => setSearchInputVal(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20 cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Category tabs */}
            <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setActiveCategory(cat.value);
                      setVisibleCount(4); // Reset visible count on category change
                    }}
                    className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10"
                        : "bg-white dark:bg-white/5 border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark dark:hover:text-white hover:border-mosque/50 hover:bg-mosque/5"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
              <div className="w-px h-6 bg-nordic-dark/10 mx-2"></div>
              <button
                onClick={() => setShowFiltersAlert(true)}
                className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark dark:text-white font-medium text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="material-icons text-base">tune</span> Filters
              </button>
            </div>
            
            {showFiltersAlert && (
              <div className="bg-hint-of-green/40 border border-mosque/20 text-nordic-dark dark:text-white p-4 rounded-xl flex items-center justify-between text-sm max-w-xl mx-auto animation-fade-in">
                <span>Advanced filters are under development. You can use the search bar or categories above!</span>
                <button 
                  onClick={() => setShowFiltersAlert(false)} 
                  className="material-icons text-lg hover:text-mosque cursor-pointer ml-2"
                >
                  close
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Featured Collections Section */}
        <section className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark dark:text-white">Featured Collections</h2>
              <p className="text-nordic-muted mt-1 text-sm">Curated properties for the discerning eye.</p>
            </div>
            <a
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque dark:text-primary hover:opacity-70 transition-opacity"
              href="#"
            >
              View all <span className="material-icons text-sm">arrow_forward</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mockFeaturedProperties.map((property) => (
              <FeaturedCard key={property.id} property={property} />
            ))}
          </div>
        </section>

        {/* New in Market Section */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark dark:text-white">New in Market</h2>
              <p className="text-nordic-muted mt-1 text-sm">Fresh opportunities added this week.</p>
            </div>
            
            {/* Rent/Buy Tabs */}
            <div className="flex bg-white dark:bg-white/5 p-1 rounded-lg">
              <button
                onClick={() => setActiveTxType("all")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  activeTxType === "all"
                    ? "bg-nordic-dark text-white shadow-sm"
                    : "text-nordic-muted hover:text-nordic-dark dark:hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTxType("sale")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  activeTxType === "sale"
                    ? "bg-nordic-dark text-white shadow-sm"
                    : "text-nordic-muted hover:text-nordic-dark dark:hover:text-white"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setActiveTxType("rent")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  activeTxType === "rent"
                    ? "bg-nordic-dark text-white shadow-sm"
                    : "text-nordic-muted hover:text-nordic-dark dark:hover:text-white"
                }`}
              >
                Rent
              </button>
            </div>
          </div>

          {/* Grid display */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties.slice(0, visibleCount).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-white/5 rounded-xl">
              <span className="material-icons text-4xl text-nordic-muted mb-2">search_off</span>
              <p className="text-nordic-muted">No properties found matching your criteria.</p>
            </div>
          )}

          {/* Load More Button */}
          {filteredProperties.length > visibleCount && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 4)}
                className="px-8 py-3 bg-white dark:bg-white/5 border border-nordic-dark/10 dark:border-white/10 hover:border-mosque hover:text-mosque text-nordic-dark dark:text-white font-medium rounded-lg transition-all hover:shadow-md cursor-pointer"
              >
                Load more properties
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
