<?php

namespace App\Swagger;

/**
 * @OA\Info(
 *     title="Monolit API",
 *     version="1.0.0",
 *     description="Monolit API"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="apiKey",
 *     in="header",
 *     name="Authorization",
 *     description="Enter token in format (Bearer <token>)"
 * )
 *
 * @OA\Parameter(
 *     parameter="AcceptJson",
 *     name="Accept",
 *     in="header",
 *     required=true,
 *     description="Accept JSON response",
 *     @OA\Schema(
 *         type="string",
 *         default="application/json"
 *     )
 * )
 */
class ApiDocumentation
{
    // Other Swagger-related annotations if needed
}
