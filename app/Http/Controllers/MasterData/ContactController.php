<?php
namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Contracts\Services\ContactServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller {
    protected $contactService;

    public function __construct(ContactServiceInterface $contactService) {
        $this->contactService = $contactService;
    }

    public function index() {
        $contacts = $this->contactService->getContacts();
        return Inertia::render('contact/Index', compact('contacts'));
    }

    public function store(Request $request) {
        $data = $request->validate([
            'name' => 'required',
            'type' => 'required|in:customer,supplier',
            'phone' => 'nullable',
            'email' => 'nullable|email'
        ]);

        $this->contactService->contactCreate($data);
        return redirect()->back()->with('success', 'Contact Created!');
    }
}