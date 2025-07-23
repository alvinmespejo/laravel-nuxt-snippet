<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\v1\SnippetRequest;
use App\Http\Resources\Api\v1\SnippetResource;
use App\Models\Snippet;
use App\Policies\Api\v1\SnippetPolicy;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class SnippetController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $snippets = Snippet::query()
            ->with(['user'])
            ->take($request->get('limit', 15))
            ->latest()
            ->public()
            ->get();

        return SnippetResource::collection($snippets);
    }

    public function me(Request $request)
    {
        $snippets = Snippet::query()
            ->where('user_id', $request->user()->id)
            ->with(['user'])
            ->take($request->get('limit', 15))
            ->latest()
            ->get();

        return SnippetResource::collection($snippets);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        try {
            $snippet = $user->snippets()->create([
                'uuid' => \Illuminate\Support\Str::uuid7()
            ]);

            return new SnippetResource($snippet->load('steps', 'user'));
        } catch (\Throwable $th) {
            Log::error('STORE ERROR', [$th]);
            return response()->json(['error' => $th->getMessage()], 500);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Snippet $snippet)
    {
        $this->authorize('view', $snippet);
        try {
            return new SnippetResource($snippet->load(['user', 'steps']));
        } catch (\Throwable $th) {
            Log::error('SHOW ERROR', [$th]);
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(SnippetRequest $request, Snippet $snippet)
    {
        $this->authorize('update', $snippet);
        try {
            $snippet->update($request->safe()->only('title', 'body', 'is_public'));
            return new SnippetResource($snippet);
        } catch (\Throwable $th) {
            Log::error('UPDATE ERROR', [$th]);
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Snippet $snippet)
    {
        $this->authorize('delete', $snippet);
        try {
            $snippet->delete();
            return response()->json([], Response::HTTP_NO_CONTENT);
        } catch (\Throwable $th) {
            Log::error('DELETE ERROR', [$th]);
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
}
