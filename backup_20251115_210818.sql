--
-- PostgreSQL database dump
--

\restrict XQFhfwyW4ojMbOpu91ShkmuVq3Jgd7YYQnPo5ojBF1owqP3JFm7VJyrwlNPYNPP

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: fce_user
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admins OWNER TO fce_user;

--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: fce_user
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.admins_id_seq OWNER TO fce_user;

--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fce_user
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: comunicados; Type: TABLE; Schema: public; Owner: fce_user
--

CREATE TABLE public.comunicados (
    id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    contenido text,
    fecha date,
    archivo character varying(255),
    imagen character varying(255),
    fecha_vencimiento date,
    oficina character varying(20) DEFAULT 'fce'::character varying,
    CONSTRAINT check_comunicados_oficina CHECK (((oficina)::text = ANY ((ARRAY['fce'::character varying, 'cesepi'::character varying, 'ocaa'::character varying, 'cerseu'::character varying, 'posgrado'::character varying])::text[])))
);


ALTER TABLE public.comunicados OWNER TO fce_user;

--
-- Name: comunicados_id_seq; Type: SEQUENCE; Schema: public; Owner: fce_user
--

CREATE SEQUENCE public.comunicados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comunicados_id_seq OWNER TO fce_user;

--
-- Name: comunicados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fce_user
--

ALTER SEQUENCE public.comunicados_id_seq OWNED BY public.comunicados.id;


--
-- Name: contactos; Type: TABLE; Schema: public; Owner: fce_user
--

CREATE TABLE public.contactos (
    id integer NOT NULL,
    oficina character varying(255) NOT NULL,
    nombre character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    telefono character varying(255),
    mensaje text NOT NULL,
    leido boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT check_contactos_oficina CHECK (((oficina)::text = ANY ((ARRAY['fce'::character varying, 'cesepi'::character varying, 'ocaa'::character varying, 'cerseu'::character varying, 'posgrado'::character varying])::text[])))
);


ALTER TABLE public.contactos OWNER TO fce_user;

--
-- Name: contactos_id_seq; Type: SEQUENCE; Schema: public; Owner: fce_user
--

CREATE SEQUENCE public.contactos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contactos_id_seq OWNER TO fce_user;

--
-- Name: contactos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fce_user
--

ALTER SEQUENCE public.contactos_id_seq OWNED BY public.contactos.id;


--
-- Name: doctorados; Type: TABLE; Schema: public; Owner: fce_user
--

CREATE TABLE public.doctorados (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    imagen character varying(255),
    enlace character varying(255),
    oficina character varying(20) DEFAULT 'fce'::character varying,
    CONSTRAINT check_doctorados_oficina CHECK (((oficina)::text = ANY ((ARRAY['fce'::character varying, 'cesepi'::character varying, 'ocaa'::character varying, 'cerseu'::character varying, 'posgrado'::character varying])::text[])))
);


ALTER TABLE public.doctorados OWNER TO fce_user;

--
-- Name: doctorados_id_seq; Type: SEQUENCE; Schema: public; Owner: fce_user
--

CREATE SEQUENCE public.doctorados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.doctorados_id_seq OWNER TO fce_user;

--
-- Name: doctorados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fce_user
--

ALTER SEQUENCE public.doctorados_id_seq OWNED BY public.doctorados.id;


--
-- Name: egresados; Type: TABLE; Schema: public; Owner: fce_user
--

CREATE TABLE public.egresados (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    titulo character varying(255),
    empresa character varying(255),
    testimonio text,
    imagen character varying(255),
    oficina character varying(20) DEFAULT 'fce'::character varying,
    CONSTRAINT check_egresados_oficina CHECK (((oficina)::text = ANY ((ARRAY['fce'::character varying, 'cesepi'::character varying, 'ocaa'::character varying, 'cerseu'::character varying, 'posgrado'::character varying])::text[])))
);


ALTER TABLE public.egresados OWNER TO fce_user;

--
-- Name: egresados_id_seq; Type: SEQUENCE; Schema: public; Owner: fce_user
--

CREATE SEQUENCE public.egresados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.egresados_id_seq OWNER TO fce_user;

--
-- Name: egresados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fce_user
--

ALTER SEQUENCE public.egresados_id_seq OWNED BY public.egresados.id;


--
-- Name: eventos; Type: TABLE; Schema: public; Owner: fce_user
--

CREATE TABLE public.eventos (
    id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    fecha date,
    imagen character varying(255),
    descripcion text,
    url character varying(255),
    fecha_vencimiento date,
    oficina character varying(20) DEFAULT 'fce'::character varying,
    CONSTRAINT check_eventos_oficina CHECK (((oficina)::text = ANY ((ARRAY['fce'::character varying, 'cesepi'::character varying, 'ocaa'::character varying, 'cerseu'::character varying, 'posgrado'::character varying])::text[])))
);


ALTER TABLE public.eventos OWNER TO fce_user;

--
-- Name: eventos_id_seq; Type: SEQUENCE; Schema: public; Owner: fce_user
--

CREATE SEQUENCE public.eventos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.eventos_id_seq OWNER TO fce_user;

--
-- Name: eventos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fce_user
--

ALTER SEQUENCE public.eventos_id_seq OWNED BY public.eventos.id;


--
-- Name: maestrias; Type: TABLE; Schema: public; Owner: fce_user
--

CREATE TABLE public.maestrias (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    imagen character varying(255),
    enlace character varying(255),
    oficina character varying(20) DEFAULT 'fce'::character varying,
    CONSTRAINT check_maestrias_oficina CHECK (((oficina)::text = ANY ((ARRAY['fce'::character varying, 'cesepi'::character varying, 'ocaa'::character varying, 'cerseu'::character varying, 'posgrado'::character varying])::text[])))
);


ALTER TABLE public.maestrias OWNER TO fce_user;

--
-- Name: maestrias_id_seq; Type: SEQUENCE; Schema: public; Owner: fce_user
--

CREATE SEQUENCE public.maestrias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.maestrias_id_seq OWNER TO fce_user;

--
-- Name: maestrias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fce_user
--

ALTER SEQUENCE public.maestrias_id_seq OWNED BY public.maestrias.id;


--
-- Name: noticias; Type: TABLE; Schema: public; Owner: fce_user
--

CREATE TABLE public.noticias (
    id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    resumen text,
    contenido text,
    fecha date,
    imagen character varying(255),
    fecha_vencimiento date,
    oficina character varying(20) DEFAULT 'fce'::character varying,
    CONSTRAINT check_noticias_oficina CHECK (((oficina)::text = ANY ((ARRAY['fce'::character varying, 'cesepi'::character varying, 'ocaa'::character varying, 'cerseu'::character varying, 'posgrado'::character varying])::text[])))
);


ALTER TABLE public.noticias OWNER TO fce_user;

--
-- Name: noticias_id_seq; Type: SEQUENCE; Schema: public; Owner: fce_user
--

CREATE SEQUENCE public.noticias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.noticias_id_seq OWNER TO fce_user;

--
-- Name: noticias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fce_user
--

ALTER SEQUENCE public.noticias_id_seq OWNED BY public.noticias.id;


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: fce_user
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: comunicados id; Type: DEFAULT; Schema: public; Owner: fce_user
--

ALTER TABLE ONLY public.comunicados ALTER COLUMN id SET DEFAULT nextval('public.comunicados_id_seq'::regclass);


--
-- Name: contactos id; Type: DEFAULT; Schema: public; Owner: fce_user
--

ALTER TABLE ONLY public.contactos ALTER COLUMN id SET DEFAULT nextval('public.contactos_id_seq'::regclass);


--
-- Name: doctorados id; Type: DEFAULT; Schema: public; Owner: fce_user
--

ALTER TABLE ONLY public.doctorados ALTER COLUMN id SET DEFAULT nextval('public.doctorados_id_seq'::regclass);


--
-- Name: egresados id; Type: DEFAULT; Schema: public; Owner: fce_user
--

ALTER TABLE ONLY public.egresados ALTER COLUMN id SET DEFAULT nextval('public.egresados_id_seq'::regclass);


--
-- Name: eventos id; Type: DEFAULT; Schema: public; Owner: fce_user
--

ALTER TABLE ONLY public.eventos ALTER COLUMN id SET DEFAULT nextval('public.eventos_id_seq'::regclass);


--
-- Name: maestrias id; Type: DEFAULT; Schema: public; Owner: fce_user
--

ALTER TABLE ONLY public.maestrias ALTER COLUMN id SET DEFAULT nextval('public.maestrias_id_seq'::regclass);


--
-- Name: noticias id; Type: DEFAULT; Schema: public; Owner: fce_user
--

ALTER TABLE ONLY public.noticias ALTER COLUMN id SET DEFAULT nextval('public.noticias_id_seq'::regclass);


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: fce_user
--

COPY public.admins (id, username, password, email, created_at, updated_at) FROM stdin;
1	fce_admin	unmsm2025	\N	2025-11-12 16:19:34.768128	2025-11-12 16:19:34.768128
\.


--
-- Data for Name: comunicados; Type: TABLE DATA; Schema: public; Owner: fce_user
--

COPY public.comunicados (id, titulo, contenido, fecha, archivo, imagen, fecha_vencimiento, oficina) FROM stdin;
2	Recordatorio sobre el calendario académico 2025-2	La Dirección de la Facultad recuerda a todos los estudiantes que el calendario académico 2025-2 se encuentra disponible en el portal institucional. Las fechas límite para retiro de cursos y solicitud de reposición serán estrictamente las publicadas.	2025-12-16	docs/comunicados/1762204846417_adobe.pdf	img/index/comunicados/1762204846413_calendario.jpg	2025-12-16	fce
3	Inicio del proceso de elección de delegados estudiantiles 2025-2	La Comisión Electoral de la Facultad informa que del 10 al 20 de julio se recepcionarán las candidaturas de estudiantes que deseen postularse como delegados de ciclo. Los requisitos y formularios están disponibles en la Oficina de Registros Académicos y en el portal institucional. Las votaciones se realizarán de forma virtual el 25 de julio.	2025-12-16	docs/comunicados/1762204713873_adobe.pdf	img/index/comunicados/1762204713871_votaciones.jpg	2025-12-16	fce
\.


--
-- Data for Name: contactos; Type: TABLE DATA; Schema: public; Owner: fce_user
--

COPY public.contactos (id, oficina, nombre, email, telefono, mensaje, leido, "createdAt", "updatedAt") FROM stdin;
1	fce	JOSÉ DAVID	DAVID20EGT@GMAIL.COM	946559747	hey index	f	2025-11-05 22:40:38.235+00	2025-11-05 22:40:38.235+00
2	fce	JOSÉ DAVID	DAVID20EGT@GMAIL.COM	946559747	hola otra vez	f	2025-11-06 14:29:17.359+00	2025-11-06 14:29:17.359+00
3	fce	JOSÉ DAVID	DAVID20EGT@GMAIL.COM	946559747	Ahora con Modal al envío	f	2025-11-06 14:56:28.069+00	2025-11-06 14:56:28.069+00
4	fce	JOSÉ DAVID	DAVID20EGT@GMAIL.COM	946559747	Modal con link	f	2025-11-06 14:59:37.846+00	2025-11-06 14:59:37.846+00
5	fce	JOSÉ DAVID	DAVID20EGT@GMAIL.COM	946559747	otra prueba	f	2025-11-06 15:01:24.182+00	2025-11-06 15:01:24.182+00
6	fce	JOSÉ DAVID	DAVID20EGT@GMAIL.COM	946559747	otra más	f	2025-11-06 15:04:11.31+00	2025-11-06 15:04:11.31+00
7	fce	JOSÉ DAVID	jalcaldeca@gmail.com	946559236	Hola probando el formulario	f	2025-11-06 22:23:18.693+00	2025-11-06 22:23:18.693+00
8	fce	JOSÉ DAVID	DAVID20EGT@GMAIL.COM	946559747	hola como estás	f	2025-11-07 14:50:13.207+00	2025-11-07 14:50:13.207+00
9	fce	Juan Cuscano	jcuscano@gmail.com	134568790	hola una pueba más	f	2025-11-11 22:00:30.881+00	2025-11-11 22:00:30.881+00
10	fce	JOSÉ DAVID	david@unmsm	987456123	hhhhhh	f	2025-11-12 21:30:51.677+00	2025-11-12 21:30:51.677+00
11	fce	JOSÉ DAVID	DAVID20EGT@GMAIL.COM	946559747	Probando luego del error	f	2025-11-12 21:33:29.965+00	2025-11-12 21:33:29.965+00
12	fce	Rudolfo	rjaciento@gmail.com	123456789	Probando ando	f	2025-11-12 21:56:58.511+00	2025-11-12 21:56:58.511+00
13	fce	Paisana Jacinta de Mantecoso	lapaisana@gmail.com	123456987	Ña ña ña ña ña	f	2025-11-12 22:02:41.136+00	2025-11-12 22:02:41.136+00
\.


--
-- Data for Name: doctorados; Type: TABLE DATA; Schema: public; Owner: fce_user
--

COPY public.doctorados (id, nombre, imagen, enlace, oficina) FROM stdin;
1	Doctorado en Economía	img/doctorados/1761928492872_doctorado_eco.jpg	http://localhost/posgrado.html#programas	fce
2	Doctorado en Gestión Económica Global	img/doctorados/1761928520732_doctorado_geg.png	http://localhost/posgrado.html#programas	fce
\.


--
-- Data for Name: egresados; Type: TABLE DATA; Schema: public; Owner: fce_user
--

COPY public.egresados (id, nombre, titulo, empresa, testimonio, imagen, oficina) FROM stdin;
1	Dra. María Elena Salazar	Economista Jefe	Banco Central de Reserva del Perú	La formación en la Facultad de Ciencias Económicas de la UNMSM me proporcionó las herramientas analíticas y el rigor académico necesarios para enfrentar los desafíos de la política económica en una institución clave como el BCRP.	img/index/egresados/1761862054574_egresado_03.jpg	fce
2	Carlos Mendoza López	Director de Análisis Financiero	International Monetary Fund (IMF)	Mi paso por la UNMSM fue fundamental. La sólida base teórica y el énfasis en la investigación me permitieron integrarme con éxito al equipo del FMI, donde trabajo en análisis macroeconómicos para economías emergentes.	img/index/egresados/1761862167042_egresado_02.jpg	fce
3	Ing. Ana Sofía Castro	Consultora Senior	McKinsey & Company	La UNMSM me enseñó a pensar críticamente y a abordar problemas complejos con un enfoque multidisciplinario. Estas habilidades son esenciales en mi rol actual, donde asesoro a empresas líderes en estrategia económica y transformación digital.	img/index/egresados/1761862238368_egresado_01.avif	fce
4	Dr. Jorge Alberto Ramírez	Profesor Asociado	London School of Economics (LSE)	La excelencia académica y el espíritu investigador inculcado en la Facultad de Ciencias Económicas de la UNMSM fueron pilares fundamentales para mi desarrollo profesional. Me permitieron publicar en revistas especializadas y ahora formar parte del claustro del LSE.	img/index/egresados/1761862345938_egresado_04.jpg	fce
\.


--
-- Data for Name: eventos; Type: TABLE DATA; Schema: public; Owner: fce_user
--

COPY public.eventos (id, titulo, fecha, imagen, descripcion, url, fecha_vencimiento, oficina) FROM stdin;
4	Conferencia Magistral: Tiempos de cambios económicos	2025-12-20	img/index/eventos/1762206618813_auxiliares_economia.jpg	El lugar del evento será en el Salón de grados del Pabellón nuevo de la FCE	https://www.youtube.com/watch?v=ph2Y338H710	2025-12-16	fce
1	Conferencia sobre la Globalización de la Economía	2025-12-16	img/index/eventos/1761862921328_economia_resiliente.jpg	La conferencia se dará a cabo en el salón de grados de la FCE en la fecha 02 de Diciembre .	https://www.youtube.com/watch?v=miUFz7fkQto	2025-12-16	fce
3	UNMSM promueve una economía resiliente con jornada de Gestión Integral del Riesgo de Desastres.	2025-12-16	img/index/eventos/1762205065124_economia_ambiente.jpg	UNMSM promueve una economía resiliente con jornada de Gestión Integral del Riesgo de Desastres, por eso el día 22 de Noviembre tendremos una clase magistral acerca del tema, en el salón de grados de la fce.	https://www.youtube.com/watch?v=miUFz7fkQto	2025-12-16	fce
2	Conferencia: "Impacto de los avances científicos en la economía global"	2025-12-16	img/index/eventos/1761863036575_avances_cientificos.jpg	La conferencia se dará en el salón de grados de la FCE.	https://www.youtube.com/watch?v=mAUw6KoPaC8	2025-12-16	fce
\.


--
-- Data for Name: maestrias; Type: TABLE DATA; Schema: public; Owner: fce_user
--

COPY public.maestrias (id, nombre, imagen, enlace, oficina) FROM stdin;
1	Maestría en Economía con Mención en Gestión y Políticas Públicas	img/maestrias/1761928226511_maestria_egpp.png	http://localhost/posgrado.html#programas	fce
2	Maestría en Ciencias de la Gestión Económica Empresarial	img/maestrias/1761928252034_maestria_cgee.png	http://localhost/posgrado.html#programas	fce
3	Maestría en Economía con Mención en Finanzas	img/maestrias/1761928300427_maestria_ef.png	http://localhost/posgrado.html#programas	fce
4	Maestría en Economía con Mención en Gestión del Desarrollo Sostenible	img/maestrias/1761928329910_maestria_egds.png	http://localhost/posgrado.html#programas	fce
\.


--
-- Data for Name: noticias; Type: TABLE DATA; Schema: public; Owner: fce_user
--

COPY public.noticias (id, titulo, resumen, contenido, fecha, imagen, fecha_vencimiento, oficina) FROM stdin;
3	Matrícula Abierta para el Ciclo 2025-2	Se aperturan las matrículas desde el 01 al 07 de Julio	La Facultad de Ingeniería abre el proceso de matrícula para el ciclo 2025-2. Los interesados podrán completar su inscripción en línea a través del portal institucional. El proceso incluye la entrega de documentación, validación de requisitos y asignación de horarios. No dejes pasar esta oportunidad de formarte en una de las mejores facultades del país.	2026-12-16	img/index/noticias/1761927695230_noticia1.jpg	2025-12-16	fce
4	Especialízate con los nuevos cursos de Posgrado	Nuevos cursos de posgrado recientemente aperturados	La Facultad pone a disposición de los profesionales y egresados una nueva oferta de cursos de posgrado en áreas emergentes: Inteligencia Artificial aplicada a la industria, Economía Circular, Energías Renovables y Gestión de Proyectos BIM. Los cursos son dictados por docentes con grado de maestría o doctorado y se otorga certificación internacional al finalizar cada módulo.	2025-12-16	img/index/noticias/1761927763147_noticia2.jpg	2025-12-16	fce
6	Conferencia Internacional sobre Economía Digital	Evento a realizarse gracias al apoyo de la Cámara de Comercio de Lima	El 5 de julio se realizará la Conferencia Internacional sobre Economía Digital, organizada por la Facultad en alianza con la Cámara de Comercio de Lima. Participarán expertos de Chile, Colombia, México y España quienes expondrán sobre transformación digital, fintech, criptomonedas y regulación de plataformas. El evento es gratuito con inscripción previa y se emitirán certificados de asistencia	2025-12-16	img/index/noticias/1761927919501_noticia4.jpg	2025-12-16	fce
5	Capacitación en Investigación Económica	Curso de capacitación para el mes de Junio	Durante todo el mes de junio se desarrollará el curso de capacitación en investigación económica, dirigido a estudiantes de pregrado y profesionales afines. Se abordarán técnicas cuantitativas y cualitativas, manejo de bases de datos, redacción científica y análisis de políticas públicas. Las sesiones serán presenciales los días sábados en el auditorio principal y se entregará constancia con créditos académicos	2025-12-16	img/index/noticias/1761927799510_noticia3.jpg	2025-12-16	fce
\.


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fce_user
--

SELECT pg_catalog.setval('public.admins_id_seq', 1, true);


--
-- Name: comunicados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fce_user
--

SELECT pg_catalog.setval('public.comunicados_id_seq', 3, true);


--
-- Name: contactos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fce_user
--

SELECT pg_catalog.setval('public.contactos_id_seq', 13, true);


--
-- Name: doctorados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fce_user
--

SELECT pg_catalog.setval('public.doctorados_id_seq', 2, true);


--
-- Name: egresados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fce_user
--

SELECT pg_catalog.setval('public.egresados_id_seq', 4, true);


--
-- Name: eventos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fce_user
--

SELECT pg_catalog.setval('public.eventos_id_seq', 4, true);


--
-- Name: maestrias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fce_user
--

SELECT pg_catalog.setval('public.maestrias_id_seq', 4, true);


--
-- Name: noticias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fce_user
--

SELECT pg_catalog.setval('public.noticias_id_seq', 6, true);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: fce_user
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: admins admins_username_key; Type: CONSTRAINT; Schema: public; Owner: fce_user
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_username_key UNIQUE (username);


--
-- Name: comunicados comunicados_pkey; Type: CONSTRAINT; Schema: public; Owner: fce_user
--

ALTER TABLE ONLY public.comunicados
    ADD CONSTRAINT comunicados_pkey PRIMARY KEY (id);


--
-- Name: contactos contactos_pkey; Type: CONSTRAINT; Schema: public; Owner: fce_user
--

ALTER TABLE ONLY public.contactos
    ADD CONSTRAINT contactos_pkey PRIMARY KEY (id);


--
-- Name: doctorados doctorados_pkey; Type: CONSTRAINT; Schema: public; Owner: fce_user
--

ALTER TABLE ONLY public.doctorados
    ADD CONSTRAINT doctorados_pkey PRIMARY KEY (id);


--
-- Name: egresados egresados_pkey; Type: CONSTRAINT; Schema: public; Owner: fce_user
--

ALTER TABLE ONLY public.egresados
    ADD CONSTRAINT egresados_pkey PRIMARY KEY (id);


--
-- Name: eventos eventos_pkey; Type: CONSTRAINT; Schema: public; Owner: fce_user
--

ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_pkey PRIMARY KEY (id);


--
-- Name: maestrias maestrias_pkey; Type: CONSTRAINT; Schema: public; Owner: fce_user
--

ALTER TABLE ONLY public.maestrias
    ADD CONSTRAINT maestrias_pkey PRIMARY KEY (id);


--
-- Name: noticias noticias_pkey; Type: CONSTRAINT; Schema: public; Owner: fce_user
--

ALTER TABLE ONLY public.noticias
    ADD CONSTRAINT noticias_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict XQFhfwyW4ojMbOpu91ShkmuVq3Jgd7YYQnPo5ojBF1owqP3JFm7VJyrwlNPYNPP

