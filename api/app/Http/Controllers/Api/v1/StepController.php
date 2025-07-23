<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Snippet;
use App\Models\Step;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class StepController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Snippet $snippet)
    {
        try {
            $step = $snippet->steps()->create($request->only('title', 'body'));
            Log::debug('STEPS CREATE', [$step]);
            return response()->json($step, Response::HTTP_CREATED);
        } catch (\Throwable $th) {
            Log::error('ERORR STEP CREATE', [$th]);
            return response()->json([
                'error' => 'An error occured while processing request. Please try again!'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Step $step)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Step $step)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Snippet $snippet, Step $step)
    {
        $this->authorize('update', $step);
        try {
            $step->update($request->only('title', 'body'));
            return response()->json($step, Response::HTTP_OK);
        } catch (\Throwable $th) {
            Log::error('ERORR STEP UPDATE', [$th]);
            return response()->json([
                'error' => 'An error occured while processing request. Please try again!'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Snippet $snippet, Step $step)
    {
        $this->authorize('delete', $step);
        try {
            $step->delete();
            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (\Throwable $th) {
            Log::error('ERORR STEP DELETION', [$th]);
            return response()->json([
                'error' => 'An error occured while processing request. Please try again!'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
