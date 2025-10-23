<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Context;
use App\Models\Banner;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('banner_categories', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->foreignIdFor(Context::class)->cascadeOnDelete();
            $table->foreignIdFor(Banner::class)->cascadeOnDelete();
            $table->string("type")->default(value: "catalog");
            $table->integer("category_id")->nullable();
            $table->integer("priority")->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banner_categories');
    }
};
