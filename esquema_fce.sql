--
-- PostgreSQL database dump
--

\restrict VRsYUZuakbzmjMukgCY7eY4vq1Jnrz3fOcm5pYAbMEbN1EpZpd1cWG3EPIoHZb1

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

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

--
-- Name: enum_admins_oficina; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_admins_oficina AS ENUM (
    'fce',
    'cesepi',
    'ocaa',
    'cerseu',
    'posgrado'
);


--
-- Name: enum_admins_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_admins_role AS ENUM (
    'super_admin',
    'oficina_admin'
);


--
-- Name: enum_reclamos_estado; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_reclamos_estado AS ENUM (
    'Pendiente',
    'En Proceso',
    'Resuelto',
    'Cerrado'
);


--
-- Name: enum_reclamos_tipo; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_reclamos_tipo AS ENUM (
    'Queja',
    'Reclamo',
    'Sugerencia',
    'Felicitación'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role public.enum_admins_role DEFAULT 'oficina_admin'::public.enum_admins_role,
    oficina public.enum_admins_oficina,
    nombre_completo character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    ultimo_acceso timestamp with time zone,
    activo boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: comunicados; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comunicados (
    id integer NOT NULL,
    oficina character varying(255) DEFAULT 'fce'::character varying NOT NULL,
    titulo character varying(255) NOT NULL,
    contenido text,
    fecha date,
    fecha_vencimiento date,
    archivo character varying(255),
    imagen character varying(255)
);


--
-- Name: comunicados_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comunicados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comunicados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comunicados_id_seq OWNED BY public.comunicados.id;


--
-- Name: contactos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contactos (
    id integer NOT NULL,
    oficina character varying(255) DEFAULT 'fce'::character varying NOT NULL,
    nombre character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    telefono character varying(255),
    mensaje text NOT NULL,
    leido boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: contactos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contactos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contactos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contactos_id_seq OWNED BY public.contactos.id;


--
-- Name: doctorados; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.doctorados (
    id integer NOT NULL,
    oficina character varying(255) DEFAULT 'fce'::character varying NOT NULL,
    nombre character varying(255) NOT NULL,
    imagen character varying(255),
    enlace character varying(255)
);


--
-- Name: doctorados_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.doctorados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: doctorados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.doctorados_id_seq OWNED BY public.doctorados.id;


--
-- Name: egresados; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.egresados (
    id integer NOT NULL,
    oficina character varying(255) DEFAULT 'fce'::character varying NOT NULL,
    nombre character varying(255) NOT NULL,
    titulo character varying(255),
    empresa character varying(255),
    testimonio text,
    imagen character varying(255)
);


--
-- Name: egresados_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.egresados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: egresados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.egresados_id_seq OWNED BY public.egresados.id;


--
-- Name: eventos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.eventos (
    id integer NOT NULL,
    oficina character varying(255) DEFAULT 'fce'::character varying NOT NULL,
    titulo character varying(255) NOT NULL,
    fecha date,
    fecha_vencimiento date,
    imagen character varying(255),
    descripcion text,
    url character varying(255)
);


--
-- Name: eventos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.eventos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: eventos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.eventos_id_seq OWNED BY public.eventos.id;


--
-- Name: maestrias; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.maestrias (
    id integer NOT NULL,
    oficina character varying(255) DEFAULT 'fce'::character varying NOT NULL,
    nombre character varying(255) NOT NULL,
    imagen character varying(255),
    enlace character varying(255)
);


--
-- Name: maestrias_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.maestrias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: maestrias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.maestrias_id_seq OWNED BY public.maestrias.id;


--
-- Name: noticias; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.noticias (
    id integer NOT NULL,
    oficina character varying(255) DEFAULT 'fce'::character varying NOT NULL,
    titulo character varying(255) NOT NULL,
    resumen text,
    contenido text,
    fecha date,
    fecha_vencimiento date,
    imagen character varying(255)
);


--
-- Name: noticias_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.noticias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: noticias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.noticias_id_seq OWNED BY public.noticias.id;


--
-- Name: reclamos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reclamos (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    dni character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    telefono character varying(255),
    tipo public.enum_reclamos_tipo NOT NULL,
    descripcion text NOT NULL,
    estado public.enum_reclamos_estado DEFAULT 'Pendiente'::public.enum_reclamos_estado NOT NULL,
    fecha_creacion timestamp with time zone NOT NULL,
    fecha_actualizacion timestamp with time zone NOT NULL,
    admin_respuesta text,
    fecha_respuesta timestamp with time zone,
    ip_address character varying(255),
    user_agent text
);


--
-- Name: reclamos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reclamos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reclamos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reclamos_id_seq OWNED BY public.reclamos.id;


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: comunicados id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comunicados ALTER COLUMN id SET DEFAULT nextval('public.comunicados_id_seq'::regclass);


--
-- Name: contactos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contactos ALTER COLUMN id SET DEFAULT nextval('public.contactos_id_seq'::regclass);


--
-- Name: doctorados id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctorados ALTER COLUMN id SET DEFAULT nextval('public.doctorados_id_seq'::regclass);


--
-- Name: egresados id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.egresados ALTER COLUMN id SET DEFAULT nextval('public.egresados_id_seq'::regclass);


--
-- Name: eventos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.eventos ALTER COLUMN id SET DEFAULT nextval('public.eventos_id_seq'::regclass);


--
-- Name: maestrias id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maestrias ALTER COLUMN id SET DEFAULT nextval('public.maestrias_id_seq'::regclass);


--
-- Name: noticias id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.noticias ALTER COLUMN id SET DEFAULT nextval('public.noticias_id_seq'::regclass);


--
-- Name: reclamos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reclamos ALTER COLUMN id SET DEFAULT nextval('public.reclamos_id_seq'::regclass);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: admins admins_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_username_key UNIQUE (username);


--
-- Name: comunicados comunicados_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comunicados
    ADD CONSTRAINT comunicados_pkey PRIMARY KEY (id);


--
-- Name: contactos contactos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contactos
    ADD CONSTRAINT contactos_pkey PRIMARY KEY (id);


--
-- Name: doctorados doctorados_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctorados
    ADD CONSTRAINT doctorados_pkey PRIMARY KEY (id);


--
-- Name: egresados egresados_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.egresados
    ADD CONSTRAINT egresados_pkey PRIMARY KEY (id);


--
-- Name: eventos eventos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_pkey PRIMARY KEY (id);


--
-- Name: maestrias maestrias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maestrias
    ADD CONSTRAINT maestrias_pkey PRIMARY KEY (id);


--
-- Name: noticias noticias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.noticias
    ADD CONSTRAINT noticias_pkey PRIMARY KEY (id);


--
-- Name: reclamos reclamos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reclamos
    ADD CONSTRAINT reclamos_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict VRsYUZuakbzmjMukgCY7eY4vq1Jnrz3fOcm5pYAbMEbN1EpZpd1cWG3EPIoHZb1

