/*
  Warnings:

  - A unique constraint covering the columns `[type,theme]` on the table `doctemplate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "doctemplate_type_theme_key" ON "doctemplate"("type", "theme");
