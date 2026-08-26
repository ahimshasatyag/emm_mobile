<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Auth\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class LoginController extends Controller
{
    public function index(Request $request, $username = null)
    {
        // Check url decrypt logic (equivalent to CI3 concept)
        if ($username) {
            try {
                $decryptedUsername = decrypt($username);
                if ($decryptedUsername) {
                    session(['user' => $decryptedUsername]);
                    return redirect()->route('login');
                }
            } catch (\Exception $e) {
                // Ignore and continue if not decryptable
            }
        }

        // Check if session exists (redirect to main if already logged in)
        if (session('username')) {
            return redirect('main');
        }

        // Load the view (make sure resources/views/auth/login.blade.php is created)
        return view('auth.login');
    }

    public function login(Request $request)
    {
        // Validation rules similar to CI3
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $username = strtolower(trim($request->input('username')));
        $password = $request->input('password');

        // Fetch user from DB
        $user = User::where('username', $username)->first();

        if ($user) {
            // Verify Password
            // Note: password_verify fallback included to match exact logic in CI3
            // In a pure Laravel app you'd typically just use Hash::check
            if (Hash::check($password, $user->password) || password_verify($password, $user->password)) {
                
                if ($user->is_active == 1) {
                    
                    // Session data to set upon successful login
                    $data = [
                        'id_user' => $user->id,
                        'username' => $user->username,
                        'nm_users' => $user->nm_users,
                        'id_users_level' => $user->id_users_level,
                        'id_karyawan' => $user->id_karyawan
                    ];
                    
                    session($data);
                    
                    // Equivalent logging
                    Log::info('Login', ['username' => $username]);
                    
                    return redirect('main');
                } else {
                    return redirect()->route('login')->with('message', '<div class="alert alert-danger" role="alert">Username Tidak Aktif !</div>');
                }
                
            } else {
                return redirect()->route('login')->with('message', '<div class="alert alert-danger" role="alert">Password Salah !</div>');
            }
            
        } else {
            return redirect()->route('login')->with('message', '<div class="alert alert-danger" role="alert">Username Tidak Terdaftar !</div>');
        }
    }
}
