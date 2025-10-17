<?php

namespace Tests\Feature;

use App\Models\Warehouse;
use App\Models\WarehouseStock;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class WarehouseTest extends TestCase
{
    use DatabaseMigrations;
    /**
     * A basic feature test example.
     */
    public function test_get_warehouses(): void
    {
        Warehouse::factory()->create();
        $response = $this->get('/api/warehouses');

        $response->assertStatus(200)
            ->assertJsonIsArray()
            ->assertJsonCount(1);
    }

    public function test_get_warehouse()
    {
        $warehouse = Warehouse::factory()->create();

        $response = $this->get("/api/warehouses/" . $warehouse->id);
        $response->assertStatus(200)
        ->assertJsonFragment([
            "id" => $warehouse->id,
            "name" => $warehouse->name
        ]);
    }

    public function test_update_warehouse()
    {
        $warehouse = Warehouse::factory()->create();

        $warehouseUpdate = Warehouse::factory()->make();
        $response = $this->put("/api/warehouses/" . $warehouse->id, $warehouseUpdate->toArray());
        $response->assertStatus(200);

        $response = $this->get("/api/warehouses/" . $warehouse->id);

        $response->assertStatus(200)->assertJsonFragment([
            "name" => $warehouseUpdate->name,
        ]);
    }


    public function test_stock_warehouse()
    {
        $warehouseStock = WarehouseStock::factory()->create();
        $warehouseCount = Warehouse::where("context_id",$warehouseStock->warehouse->context_id)->count();

        $response = $this->post("/api/warehouses/stocks", [
            "category_id" => $warehouseStock->category_id,
            "context_id" => $warehouseStock->warehouse->context_id,
            "strategy" => "base"
        ]);

        $response->assertStatus(200)->assertJsonIsArray()->assertJsonFragment([
            "warehouse_name" => $warehouseStock->warehouse->name,
            "warehouse_id" => $warehouseStock->warehouse->id,
        ])->assertJsonCount($warehouseCount);
    }
}
