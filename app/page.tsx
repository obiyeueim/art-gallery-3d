"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  PresentationControls,
  Sparkles,
  useTexture,
} from "@react-three/drei";
import Lenis from "lenis";
import {
  ArrowDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Menu,
  Move3D,
  ShoppingBag,
  X,
} from "lucide-react";
import * as THREE from "three";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Artwork = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  medium: string;
  dimensions: string;
  edition: string;
  price: number;
  image: string;
  aspect: number;
  accent: string;
};

const artworks: Artwork[] = [
  {
    id: "01",
    slug: "mien-trang-xanh",
    title: "Miền Trăng Xanh",
    subtitle: "Một miền ký ức dịu nhẹ dưới ánh trăng đầu mùa.",
    year: "2026",
    medium: "Màu acrylic trên vải",
    dimensions: "70 × 42 cm",
    edition: "Bản gốc · Độc bản",
    price: 1250000,
    image: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/artworks/mien-trang-xanh.jpg`,
    aspect: 1536 / 901,
    accent: "#d8ff45",
  },
  {
    id: "02",
    slug: "phuc-loc-tho",
    title: "Phúc Lộc Thọ",
    subtitle: "Những biểu tượng truyền thống được kể lại bằng nét vẽ tự do.",
    year: "2026",
    medium: "Màu tổng hợp trên giấy",
    dimensions: "35 × 68 cm",
    edition: "Bản gốc · Độc bản",
    price: 980000,
    image: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/artworks/phuc-loc-tho.jpg`,
    aspect: 825 / 1536,
    accent: "#ff6d4a",
  },
  {
    id: "03",
    slug: "mua-hong-pho-nho",
    title: "Mùa Hồng Phố Nhỏ",
    subtitle: "Một góc phố nằm giữa sắc hoa và lớp trời hồng chuyển động.",
    year: "2026",
    medium: "Màu acrylic trên vải",
    dimensions: "44 × 80 cm",
    edition: "Bản gốc · Độc bản",
    price: 1450000,
    image: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/artworks/mua-hong-pho-nho.jpg`,
    aspect: 846 / 1536,
    accent: "#ff79bc",
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

function ArtworkObject({ artwork }: { artwork: Artwork }) {
  const loadedTexture = useTexture(artwork.image);
  const texture = useMemo(() => {
    const configuredTexture = loadedTexture.clone();
    configuredTexture.colorSpace = THREE.SRGBColorSpace;
    configuredTexture.anisotropy = 8;
    configuredTexture.needsUpdate = true;
    return configuredTexture;
  }, [loadedTexture]);
  const maxWidth = 4.45;
  const maxHeight = 4.65;
  const width = artwork.aspect >= 1 ? maxWidth : maxHeight * artwork.aspect;
  const height = artwork.aspect >= 1 ? maxWidth / artwork.aspect : maxHeight;
  const rail = 0.13;

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0, -0.06]}>
        <boxGeometry args={[width + rail * 2.7, height + rail * 2.7, 0.2]} />
        <meshStandardMaterial color="#151515" roughness={0.28} metalness={0.72} />
      </mesh>

      <mesh position={[0, 0, 0.058]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      <mesh position={[0, height / 2 + rail / 2, 0.075]} castShadow>
        <boxGeometry args={[width + rail * 2, rail, 0.14]} />
        <meshStandardMaterial color="#272723" roughness={0.24} metalness={0.88} />
      </mesh>
      <mesh position={[0, -height / 2 - rail / 2, 0.075]} castShadow>
        <boxGeometry args={[width + rail * 2, rail, 0.14]} />
        <meshStandardMaterial color="#272723" roughness={0.24} metalness={0.88} />
      </mesh>
      <mesh position={[width / 2 + rail / 2, 0, 0.075]} castShadow>
        <boxGeometry args={[rail, height, 0.14]} />
        <meshStandardMaterial color="#272723" roughness={0.24} metalness={0.88} />
      </mesh>
      <mesh position={[-width / 2 - rail / 2, 0, 0.075]} castShadow>
        <boxGeometry args={[rail, height, 0.14]} />
        <meshStandardMaterial color="#272723" roughness={0.24} metalness={0.88} />
      </mesh>

      <mesh position={[0, 0, 0.084]}>
        <planeGeometry args={[width - 0.02, height - 0.02]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.055}
          roughness={0.05}
          metalness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.04}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0, -0.17]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[Math.min(width * 0.46, 1.5), 0.58]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.9} />
      </mesh>
    </group>
  );
}

function ArtworkRig({ artwork }: { artwork: Artwork }) {
  const rig = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const enteredAt = useRef(0);

  useEffect(() => {
    enteredAt.current = performance.now();
    if (rig.current) {
      rig.current.scale.setScalar(0.72);
      rig.current.position.x = 0.55;
      rig.current.rotation.z = 0.09;
    }
  }, [artwork.slug]);

  useFrame((state, delta) => {
    if (!rig.current) return;
    const age = Math.min(1, (performance.now() - enteredAt.current) / 900);
    const targetX = hovered ? -state.pointer.y * 0.045 : 0;
    const targetY = hovered ? state.pointer.x * 0.075 : 0;
    rig.current.rotation.x = THREE.MathUtils.damp(
      rig.current.rotation.x,
      targetX,
      5,
      delta,
    );
    rig.current.rotation.y = THREE.MathUtils.damp(
      rig.current.rotation.y,
      targetY,
      5,
      delta,
    );
    rig.current.rotation.z = THREE.MathUtils.damp(
      rig.current.rotation.z,
      0,
      4.5,
      delta,
    );
    rig.current.position.x = THREE.MathUtils.damp(
      rig.current.position.x,
      0,
      4.5,
      delta,
    );
    rig.current.position.y = Math.sin(state.clock.elapsedTime * 0.75) * 0.055;
    const scale = 0.72 + age * 0.28;
    rig.current.scale.setScalar(
      THREE.MathUtils.damp(rig.current.scale.x, scale, 5, delta),
    );
  });

  return (
    <group
      ref={rig}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <PresentationControls
        global
        cursor
        speed={1.25}
        polar={[-0.42, 0.42]}
        azimuth={[-0.72, 0.72]}
        damping={0.18}
        snap
      >
        <ArtworkObject artwork={artwork} />
      </PresentationControls>
    </group>
  );
}

function GalleryScene({ artwork, modal = false }: { artwork: Artwork; modal?: boolean }) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const testCanvas = document.createElement("canvas");
        const context =
          testCanvas.getContext("webgl2", { antialias: true }) ||
          testCanvas.getContext("webgl", { antialias: true });
        setWebglSupported(Boolean(context));
      } catch {
        setWebglSupported(false);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`gallery-scene ${canvasReady ? "is-live" : ""} ${modal ? "is-modal" : ""}`}
      style={{ "--fallback-accent": artwork.accent } as React.CSSProperties}
    >
      <div className="scene-fallback" aria-hidden="true">
        <div className={`fallback-frame ${artwork.aspect >= 1 ? "landscape" : "portrait"}`}>
          <img src={artwork.image} alt="" />
        </div>
      </div>

      {webglSupported && (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, modal ? 7.2 : 7.75], fov: modal ? 41 : 38 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          shadows
          onCreated={() => setCanvasReady(true)}
          fallback={null}
        >
          <ambientLight intensity={1.35} />
          <directionalLight position={[4, 5, 6]} intensity={2.2} castShadow />
          <pointLight position={[-5, 1, 4]} intensity={34} color={artwork.accent} />
          <spotLight
            position={[0, 7, 4]}
            angle={0.38}
            penumbra={1}
            intensity={72}
            castShadow
          />
          <Sparkles
            count={modal ? 52 : 30}
            scale={[8, 6, 5]}
            size={1.1}
            speed={0.25}
            opacity={0.22}
            color={artwork.accent}
          />
          <ArtworkRig key={artwork.slug} artwork={artwork} />
          <ContactShadows
            position={[0, -2.72, 0]}
            opacity={0.42}
            scale={8}
            blur={2.8}
            far={5}
          />
        </Canvas>
      )}
    </div>
  );
}

export default function Home() {
  const [selected, setSelected] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<number[]>([]);
  const [toast, setToast] = useState("");
  const showcaseRef = useRef<HTMLElement>(null);
  const activeArtwork = artworks[selected];

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.12,
      smoothWheel: true,
      touchMultiplier: 1.1,
    });
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const section = showcaseRef.current;
      if (!section) return;
      const relative = window.scrollY - section.offsetTop;
      const progress = Math.max(0, Math.min(artworks.length - 1, relative / window.innerHeight));
      const next = Math.round(progress);
      setSelected((current) => (current === next ? current : next));
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", viewerOpen || cartOpen || menuOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [viewerOpen, cartOpen, menuOpen]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2300);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const scrollToArtwork = useCallback((index: number) => {
    const section = showcaseRef.current;
    if (!section) return;
    const safeIndex = Math.max(0, Math.min(artworks.length - 1, index));
    window.scrollTo({
      top: section.offsetTop + safeIndex * window.innerHeight + 2,
      behavior: "smooth",
    });
  }, []);

  const addToCart = (index: number) => {
    setCart((current) => [...current, index]);
    setToast(`Đã thêm “${artworks[index].title}” vào bộ sưu tập`);
  };

  const total = useMemo(
    () => cart.reduce((sum, index) => sum + artworks[index].price, 0),
    [cart],
  );

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="AN Atelier — Trang chủ">
          <span>AN</span>
          <i>/</i>
          <span>ATELIER</span>
        </a>

        <nav className="desktop-nav" aria-label="Điều hướng chính">
          <a href="#collection">Bộ sưu tập</a>
          <a href="#story">Câu chuyện</a>
          <a href="#contact">Liên hệ</a>
        </nav>

        <div className="header-actions">
          <button
            className="cart-button"
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Mở giỏ hàng, ${cart.length} sản phẩm`}
          >
            <ShoppingBag size={18} strokeWidth={1.7} />
            <span>CART</span>
            <b>{String(cart.length).padStart(2, "0")}</b>
          </button>
          <button
            className="menu-button"
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Mở menu"
          >
            <Menu size={21} />
          </button>
        </div>
      </header>

      <section className="showcase" id="top" ref={showcaseRef}>
        <div className="showcase-sticky">
          <div className="ambient-orb" style={{ "--art-accent": activeArtwork.accent } as React.CSSProperties} />
          <div className="grain" />

          <div className="hero-copy" key={`copy-${selected}`}>
            <span className="eyebrow">DIGITAL EXHIBITION · ORIGINAL ART</span>
            <h1>
              Art you can
              <br />
              <em>move around.</em>
            </h1>
            <p>
              Không chỉ ngắm một bức tranh. Hãy chạm, xoay và cảm nhận từng tác phẩm
              trong không gian ba chiều.
            </p>
          </div>

          <div className="scene-shell" aria-label={`Mô hình 3D của ${activeArtwork.title}`}>
            <GalleryScene artwork={activeArtwork} />
            <button
              className="fullscreen-button"
              type="button"
              onClick={() => setViewerOpen(true)}
            >
              <Maximize2 size={17} />
              <span>FULL VIEW</span>
            </button>
            <div className="drag-hint">
              <Move3D size={18} />
              <span>KÉO ĐỂ XOAY · RÊ CHUỘT ĐỂ NGHIÊNG</span>
            </div>
          </div>

          <div className="artwork-meta" key={`meta-${selected}`}>
            <div className="meta-index">
              <b>{activeArtwork.id}</b>
              <span>/ {String(artworks.length).padStart(2, "0")}</span>
            </div>
            <span className="artwork-year">COLLECTION {activeArtwork.year}</span>
            <h2>{activeArtwork.title}</h2>
            <p>{activeArtwork.subtitle}</p>
            <div className="meta-specs">
              <span>{activeArtwork.medium}</span>
              <span>{activeArtwork.dimensions}</span>
              <span>{activeArtwork.edition}</span>
            </div>
            <div className="buy-row">
              <strong>{formatPrice(activeArtwork.price)}</strong>
              <button type="button" onClick={() => addToCart(selected)}>
                THÊM VÀO GIỎ <ArrowRight size={17} />
              </button>
            </div>
          </div>

          <div className="showcase-controls">
            <button
              type="button"
              onClick={() => scrollToArtwork(selected - 1)}
              disabled={selected === 0}
              aria-label="Tranh trước"
            >
              <ChevronLeft />
            </button>
            <div className="progress-dots">
              {artworks.map((artwork, index) => (
                <button
                  key={artwork.slug}
                  className={index === selected ? "active" : ""}
                  type="button"
                  onClick={() => scrollToArtwork(index)}
                  aria-label={`Xem ${artwork.title}`}
                >
                  <span />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => scrollToArtwork(selected + 1)}
              disabled={selected === artworks.length - 1}
              aria-label="Tranh tiếp theo"
            >
              <ChevronRight />
            </button>
          </div>

          <div className="scroll-cue">
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown size={16} />
          </div>
        </div>

        <div className="scroll-steps" aria-hidden="true">
          {artworks.map((artwork) => (
            <div key={artwork.slug} className="scroll-step" />
          ))}
        </div>
      </section>

      <section className="collection-section" id="collection">
        <div className="section-heading">
          <span>01 / SELECTED WORKS</span>
          <h2>
            Những tác phẩm
            <br />
            <em>đang được trưng bày.</em>
          </h2>
          <p>Mỗi tác phẩm là bản gốc duy nhất, đi kèm chứng nhận và đóng gói bảo vệ.</p>
        </div>

        <div className="collection-grid">
          {artworks.map((artwork, index) => (
            <article
              className={`collection-card card-${index + 1}`}
              key={artwork.slug}
            >
              <button
                className="card-image"
                type="button"
                onClick={() => scrollToArtwork(index)}
                aria-label={`Xem ${artwork.title} trong không gian 3D`}
              >
                <img src={artwork.image} alt={artwork.title} loading="lazy" />
                <span>VIEW IN 3D</span>
                <Maximize2 size={19} />
              </button>
              <div className="card-info">
                <div>
                  <span>{artwork.id} / ORIGINAL</span>
                  <h3>{artwork.title}</h3>
                </div>
                <strong>{formatPrice(artwork.price)}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section" id="story">
        <div className="story-number">02</div>
        <div className="story-copy">
          <span>THE STUDIO / AN ATELIER</span>
          <h2>
            Một góc nhìn trẻ.
            <br />
            Một ngôn ngữ <em>rất riêng.</em>
          </h2>
          <p>
            AN / ATELIER là không gian dành cho những tác phẩm được tạo nên bằng
            quan sát, ký ức và màu sắc đời thường. Gallery số giúp mỗi bức tranh
            được nhìn gần hơn, nhiều chiều hơn và tự nhiên hơn.
          </p>
        </div>
        <div className="story-values">
          <article>
            <b>01</b>
            <span>ORIGINAL</span>
            <p>Mỗi tác phẩm chỉ có một bản gốc.</p>
          </article>
          <article>
            <b>02</b>
            <span>HANDMADE</span>
            <p>Được vẽ và hoàn thiện hoàn toàn bằng tay.</p>
          </article>
          <article>
            <b>03</b>
            <span>ARCHIVED</span>
            <p>Đi kèm mã tác phẩm và thông tin lưu trữ.</p>
          </article>
        </div>
      </section>

      <footer id="contact">
        <div className="footer-top">
          <span>HAVE A WALL IN MIND?</span>
          <a href="mailto:studio@anatelier.vn">
            LET&apos;S TALK <ArrowRight />
          </a>
        </div>
        <div className="footer-links">
          <div>
            <span>CONTACT</span>
            <a href="mailto:studio@anatelier.vn">studio@anatelier.vn</a>
            <a href="tel:0901123206">0901 123 206</a>
          </div>
          <div>
            <span>STUDIO</span>
            <p>Biên Hòa, Đồng Nai</p>
            <p>Hẹn trước khi ghé</p>
          </div>
          <div>
            <span>FOLLOW</span>
            <a href="#top">Instagram ↗</a>
            <a href="#top">Facebook ↗</a>
          </div>
        </div>
        <div className="footer-wordmark">AN ATELIER®</div>
        <div className="footer-bottom">
          <span>© 2026 AN / ATELIER</span>
          <span>ORIGINAL ART · DIGITAL EXPERIENCE</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>

      {viewerOpen && (
        <div className="viewer-modal" role="dialog" aria-modal="true" aria-label="Xem tranh 3D toàn màn hình">
          <button
            className="modal-close"
            type="button"
            onClick={() => setViewerOpen(false)}
            aria-label="Đóng chế độ toàn màn hình"
          >
            <X />
          </button>
          <div className="viewer-title">
            <span>{activeArtwork.id} / FULL VIEW</span>
            <h2>{activeArtwork.title}</h2>
          </div>
          <div className="viewer-canvas">
            <GalleryScene artwork={activeArtwork} modal />
          </div>
          <div className="viewer-help">
            <Move3D size={18} /> KÉO / VUỐT ĐỂ XOAY TOÀN BỘ KHUNG TRANH
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="menu-overlay" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" onClick={() => setMenuOpen(false)} aria-label="Đóng menu">
            <X />
          </button>
          <nav>
            <a href="#collection" onClick={() => setMenuOpen(false)}>
              <span>01</span> Bộ sưu tập
            </a>
            <a href="#story" onClick={() => setMenuOpen(false)}>
              <span>02</span> Câu chuyện
            </a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              <span>03</span> Liên hệ
            </a>
          </nav>
          <p>AN / ATELIER · ORIGINAL ART FROM BIÊN HÒA</p>
        </div>
      )}

      {cartOpen && (
        <div className="cart-layer" role="dialog" aria-modal="true" aria-label="Giỏ hàng">
          <button className="cart-backdrop" type="button" onClick={() => setCartOpen(false)} aria-label="Đóng giỏ hàng" />
          <aside className="cart-drawer">
            <div className="cart-head">
              <div>
                <span>YOUR COLLECTION</span>
                <h2>Giỏ hàng ({cart.length})</h2>
              </div>
              <button type="button" onClick={() => setCartOpen(false)} aria-label="Đóng giỏ hàng">
                <X />
              </button>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingBag size={30} strokeWidth={1.3} />
                  <p>Bạn chưa chọn tác phẩm nào.</p>
                  <button type="button" onClick={() => setCartOpen(false)}>KHÁM PHÁ BỘ SƯU TẬP</button>
                </div>
              ) : (
                cart.map((index, itemIndex) => (
                  <article key={`${artworks[index].slug}-${itemIndex}`}>
                    <img src={artworks[index].image} alt="" />
                    <div>
                      <span>ORIGINAL / {artworks[index].id}</span>
                      <h3>{artworks[index].title}</h3>
                      <strong>{formatPrice(artworks[index].price)}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCart((items) => items.filter((_, i) => i !== itemIndex))}
                      aria-label={`Xóa ${artworks[index].title}`}
                    >
                      <X size={17} />
                    </button>
                  </article>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="cart-footer">
                <div><span>TỔNG TẠM TÍNH</span><strong>{formatPrice(total)}</strong></div>
                <button type="button" onClick={() => setToast("Đây là giao diện đặt mua demo")}>GỬI YÊU CẦU MUA <ArrowRight /></button>
                <p>Giá và thông tin sản phẩm hiện là dữ liệu minh họa.</p>
              </div>
            )}
          </aside>
        </div>
      )}

      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </main>
  );
}
