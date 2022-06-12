-- CreateTable
CREATE TABLE "doctemplate" (
    "id" SERIAL NOT NULL,
    "type" "RequestType" NOT NULL,
    "theme" "Theme" NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "doctemplate_pkey" PRIMARY KEY ("id")
);
