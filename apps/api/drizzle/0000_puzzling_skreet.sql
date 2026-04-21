CREATE TYPE "public"."ContentStatus" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."Difficulty" AS ENUM('beginner', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TYPE "public"."EntityType" AS ENUM('GUIDE', 'TOOL');--> statement-breakpoint
CREATE TYPE "public"."RelationType" AS ENUM('RELATES_TO', 'MENTIONS', 'PREREQUISITE', 'ALTERNATIVE');--> statement-breakpoint
CREATE TYPE "public"."ToolPrice" AS ENUM('FREE', 'PAID', 'MIXED');--> statement-breakpoint
CREATE TYPE "public"."ToolStatus" AS ENUM('ACTIVE', 'DEPRECATED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."ToolTier" AS ENUM('FREE', 'FREEMIUM', 'PRO', 'ENTERPRISE');--> statement-breakpoint
CREATE TABLE "ai_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"sources" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_summaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_type" text NOT NULL,
	"content_id" uuid NOT NULL,
	"summary" text NOT NULL,
	"model" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"icon" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "Category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "content_relations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_type" "EntityType" NOT NULL,
	"source_id" uuid NOT NULL,
	"target_type" "EntityType" NOT NULL,
	"target_id" uuid NOT NULL,
	"relation_type" "RelationType" NOT NULL,
	"weight" double precision,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_type" text NOT NULL,
	"content_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Guide" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content" text,
	"readingTime" integer,
	"difficulty" "Difficulty",
	"status" "ContentStatus" DEFAULT 'DRAFT' NOT NULL,
	"categoryId" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "Guide_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "guide_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guide_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "search_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"content" text NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"tags" text[],
	"category" text NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "search_queries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"query" text NOT NULL,
	"results_count" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Tag" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "Tag_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "Tool" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"website" text,
	"github" text,
	"icon" text,
	"active" boolean DEFAULT true NOT NULL,
	"tier" "ToolTier" NOT NULL,
	"price" "ToolPrice" NOT NULL,
	"popularity" integer DEFAULT 0 NOT NULL,
	"categoryId" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "Tool_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tool_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tool_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Guide" ADD CONSTRAINT "Guide_categoryId_Category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_tags" ADD CONSTRAINT "guide_tags_guide_id_Guide_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."Guide"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_tags" ADD CONSTRAINT "guide_tags_tag_id_Tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."Tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_categoryId_Category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tool_tags" ADD CONSTRAINT "tool_tags_tool_id_Tool_id_fk" FOREIGN KEY ("tool_id") REFERENCES "public"."Tool"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tool_tags" ADD CONSTRAINT "tool_tags_tag_id_Tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."Tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_content_relations_source" ON "content_relations" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "idx_content_relations_target" ON "content_relations" USING btree ("target_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_guide_tags" ON "guide_tags" USING btree ("guide_id","tag_id");--> statement-breakpoint
CREATE INDEX "idx_guide_tags_guide" ON "guide_tags" USING btree ("guide_id");--> statement-breakpoint
CREATE INDEX "idx_guide_tags_tag" ON "guide_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_tool_tags" ON "tool_tags" USING btree ("tool_id","tag_id");--> statement-breakpoint
CREATE INDEX "idx_tool_tags_tool" ON "tool_tags" USING btree ("tool_id");--> statement-breakpoint
CREATE INDEX "idx_tool_tags_tag" ON "tool_tags" USING btree ("tag_id");