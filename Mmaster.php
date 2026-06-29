<?php

defined('BASEPATH') or exit('No direct script access allowed');

use Ozdemir\Datatables\Datatables;
use Ozdemir\Datatables\DB\CodeigniterAdapter;

class Mmaster extends CI_Model
{
    public function data($i_menu, $folder)
    {
        $datatables = new Datatables(new CodeigniterAdapter);
        $datatables->query("select
        a.id,
        b.code_product ,
        b.nm_product ,
        c.nm_users ,
        a.status,
        '$folder' as folder
    from
        m_product_price_req a
    inner join m_product b on
        (a.id_product = b.id_product)
    inner join m_users c on
        (a.username = c.username)");
        $datatables->hide('folder');
        $datatables->hide('id');

        $datatables->edit('code_product', function ($data) {
            $id = $data['id'];
            $code_product = $data['code_product'];
            $folder = $data['folder'];

            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$id/f\",\"#main\"); return false;'>$code_product</a>";
            return $hasil;
        });

        $datatables->edit('nm_product', function ($data) {
            $id = $data['id'];
            $nm_product = $data['nm_product'];
            $folder = $data['folder'];

            $nm_product_potong = $nm_product;
            if (strlen($nm_product_potong) > 40) {
                $nm_product_potong = substr($nm_product_potong, 0, 40) . "...";
            }


            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$id/f\",\"#main\"); return false;' data-toggle='tooltip' data-placement='top' title='" . $nm_product . "'>$nm_product_potong</a>";
            return $hasil;
        });

        $datatables->edit('nm_users', function ($data) {
            $id = $data['id'];
            $nm_users = $data['nm_users'];
            $folder = $data['folder'];

            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$id/f\",\"#main\"); return false;'>$nm_users</a>";
            return $hasil;
        });

        $datatables->edit('status', function ($data) {
            $id = $data['id'];
            $status = $data['status'];
            $folder = $data['folder'];

            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$id/f\",\"#main\"); return false;'>$status</a>";
            return $hasil;
        });

        return $datatables->generate();
    }

    public function data_product(){
        return $this->db->get("m_product");
    }

    public function data_user(){
        return $this->db->query("select * from m_users where is_active = 1");
    }
    
    public function insert_header($id_product, $username){

        $data = [
            'id_product' => $id_product,
            'product_price_req' => 0,
            'product_price_acc' => 0,
            'username' => $username,
            'status' => 'DRAFT'
        ];

        $this->db->insert('m_product_price_req', $data);

    }

    public function data_header($id){
        return $this->db->query("select
        a.id,
        a.id_product,
        b.code_product ,
        b.nm_product ,
        a.product_price_req ,
        a.product_price_acc ,
        c.nm_users ,
        a.status
    from
        m_product_price_req a
    inner join m_product b on
        (a.id_product = b.id_product)
    inner join m_users c on
        (a.username = c.username)
        where a.id = '$id'
        ");
    }

    public function update_header($id, $id_product){
        
        $data = [
            'id_product' => $id_product,
        ];

        $this->db->where('id', $id);
        $this->db->update('m_product_price_req', $data);
    }

    public function ganti_status($id, $status){
        $data = [
            'status' => $status,
        ];

        $this->db->where('id', $id);
        $this->db->update('m_product_price_req', $data); 
    }

    public function update_price_acc($id, $product_price_acc){
        
        $data = [
            'product_price_acc' => $product_price_acc,
        ];

        $this->db->where('id', $id);
        $this->db->update('m_product_price_req', $data);
    }

    public function update_f_kirim($id, $f_kirim){
        $data = [
            'f_kirim' => $f_kirim
        ];

        $this->db->where('id', $id);
        $this->db->update('m_product_price_req', $data);
    }


}

/* End of file Mmaster.php */
