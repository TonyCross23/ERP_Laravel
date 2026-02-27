<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stock_moves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained();
            $table->foreignId('warehouse_id')->constrained();
            $table->integer('quantity'); // ဝင်ရင် အပေါင်း (+), ထွက်ရင် အနုတ် (-)
            $table->string('reference'); // ဥပမာ: SO-0001, PO-0005
            $table->enum('type', ['in', 'out', 'adjustment']); // အဝင်၊ အထွက်၊ ညှိနှိုင်းမှု
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_moves');
    }
};
