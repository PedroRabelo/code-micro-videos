<?php

namespace Tests\Feature\Models;

use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use DatabaseMigrations;

    public function testList()
    {
        $category = Category::create([
            'name' => 'test1'
        ]);
        $categories = Category::all();
        $this->assertCount(1, $categories);
    }
}
