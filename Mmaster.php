<?php

defined('BASEPATH') or exit('No direct script access allowed');

use Ozdemir\Datatables\Datatables;
use Ozdemir\Datatables\DB\CodeigniterAdapter;

class Mmaster extends CI_Model
{
    public function data($i_menu, $folder)
    {
        $datatables = new Datatables(new CodeigniterAdapter);

        $datatables->query("select a.id_po, a.code_po, a.date_po, a.status_po, '$folder' as folder from tb_po_hdr a where status_po in('QUOTATION','DRAFT', 'CANCEL')");


        $datatables->edit('code_po', function ($data) {
            $code_po = $data['code_po'];
            $id_po = $data['id_po'];
            $folder = $data['folder'];

            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$id_po/f\",\"#main\"); return false;'>$code_po</a>";
            return $hasil;
        });

        $datatables->edit('date_po', function ($data) {
            $date_po = date("d-m-Y", strtotime($data['date_po']));
            $id_po = $data['id_po'];
            $folder = $data['folder'];

            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$id_po/f\",\"#main\"); return false;'>$date_po</a>";
            return $hasil;
        });

        $datatables->edit('status_po', function ($data) {
            $status_po = $data['status_po'];
            $id_po = $data['id_po'];
            $folder = $data['folder'];

            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$id_po/f\",\"#main\"); return false;'>$status_po</a>";
            return $hasil;
        });

        return $datatables->generate();
    }


    public function data_supplier()
    {
        return $this->db->get("m_suppliers");
    }

    public function data_gudang()
    {
        return $this->db->get("m_gudang");
    }

    public function data_product()
    {
        return $this->db->get("m_product");
    }


    public function simpan_po_hdr($code_po, $date_po, $status_po, $date_schdl, $id_suppliers, $nm_suppliers, $id_gudang, $mata_uang, $partner_ref, $notes, $id_product_lokasi)
    {

        $data = array(
            'code_po' => $code_po,
            'date_po' => $date_po,
            'status_po' => $status_po,
            'date_schdl' => $date_schdl,
            'id_suppliers' => $id_suppliers,
            'nm_suppliers' => $nm_suppliers,
            'id_gudang' => $id_gudang,
            'id_mata_uang' => $mata_uang,
            'partner_ref' => $partner_ref,
            'notes' => $notes,
            'amount_total' => 0,
            'id_product_lokasi' => $id_product_lokasi,
            'date_create' => current_datetime()
        );


        $this->db->insert('tb_po_hdr', $data);
        return $this->db->insert_id();
    }

    public function update_amount_total($id_po, $amount_total)
    {

        $data = array(
            'amount_total' => $amount_total
        );


        $this->db->where('id_po', $id_po);

        $this->db->update('tb_po_hdr', $data);
    }


    public function simpan_po_dtl($id_po, $id_product, $code_product, $nm_product, $product_deskripsi, $qty_po, $product_price, $notes)
    {

        $data = array(
            'id_po' => $id_po,
            'id_product' => $id_product,
            'code_product' => $code_product,
            'nm_product' => $nm_product,
            'product_deskripsi' => $product_deskripsi,
            'qty' => $qty_po,
            'product_price' => $product_price,
            'notes' => $notes,
        );


        $this->db->insert('tb_po_dtl', $data);
        $this->db->insert_id();
        return $this->db->insert_id();
    }
    
    public function simpan_po_opt_dtl($id_po_dtl, $id_product, $id_po, $nm_product_opt, $harga)
    {
        $data = array(
            'id_po_dtl'      => $id_po_dtl,
            'id_product'     => $id_product,
            'id_po'          => $id_po,
            'nm_product_opt' => $nm_product_opt,
            'harga'          => $harga
        );
        $this->db->insert('tb_po_opt_dtl', $data);
    }


    public function get_product_options($id_po_dtl)
    {
        return $this->db->query("
            SELECT id_po, id_product, id_po_dtl, nm_product_opt, harga 
            FROM tb_po_opt_dtl 
            WHERE id_po_dtl = $id_po_dtl
        ")->result();
    }

    public function check_qty_dtl($id_po, $id_product)
    {
        return $this->db->query("select id_po_dtl from tb_po_dtl where id_po = '$id_po' and id_product = '$id_product'");
    }

    public function update_po_dtl($id_po_dtl, $qty, $id_product)
    {

        $this->db->query("update tb_po_dtl set qty = qty + $qty where id_product = '$id_product' and id_po_dtl = '$id_po_dtl'");
    }

    public function update_po_opt_dtl($id_po_dtl, $id_product, $id_po, $nm_product_opt, $harga)
    {
        $data = array(
            'nm_product_opt' => $nm_product_opt,
            'harga'          => $harga
        );
        $this->db->where('id_po_dtl', $id_po_dtl);
        $this->db->where('id_product', $id_product);
        $this->db->where('id_po', $id_po);
        $this->db->update('tb_po_opt_dtl', $data);
    }

    public function data_header($id_po)
    {
        return $this->db->query("
        SELECT
	a.*,
	b.nm_suppliers,
	c.nm_gudang,
	d.name as 'mata_uang',
	e.nm_product_lokasi,
    e.complete_name
from
	tb_po_hdr a
inner join m_suppliers b on
	(a.id_suppliers = b.id_suppliers)
inner join m_gudang c on
	(a.id_gudang = c.id_gudang)
inner join m_mata_uang d on
	(a.id_mata_uang = d.id_mata_uang)
inner join m_product_lokasi e on
	(a.id_product_lokasi = e.id_product_lokasi)
WHERE
	a.id_po = $id_po");
    }

    public function data_detail($id_po)
    {
        return $this->db->query("
        select
	a.*,
    b.code_product,
	b.nm_product,
	b.product_deskripsi,
	c.nm_product_satuan
from
	tb_po_dtl a
inner join m_product b on(a.id_product = b.id_product)
inner join m_product_satuan c on(b.id_product_satuan = b.id_product_satuan)
where
	id_po = '$id_po'");
    }


    public function ganti_status_hdr($id_po, $status_po)
    {

        $data = array(
            'status_po' => $status_po
        );


        $this->db->where('id_po', $id_po);

        $this->db->update('tb_po_hdr', $data);
    }


    public function update_po_hdr($id_po, $date_po, $date_schdl, $id_suppliers, $nm_suppliers, $id_gudang, $mata_uang, $partner_ref, $notes, $id_product_lokasi, $link_file = null)
    {


        $data = array(
            'date_po' => $date_po,
            'date_schdl' => $date_schdl,
            'id_suppliers' => $id_suppliers,
            'nm_suppliers' => $nm_suppliers,
            'id_gudang' => $id_gudang,
            'id_mata_uang' => $mata_uang,
            'partner_ref' => $partner_ref,
            'notes' => $notes,
            'id_product_lokasi' => $id_product_lokasi
        );

        if ($link_file != null) {
            $data['link_file'] = $link_file;
        }


        $this->db->where('id_po', $id_po);

        $this->db->update('tb_po_hdr', $data);
    }

    public function delete_po_dtl($id_po)
    {
        $this->db->where('id_po', $id_po);
        $this->db->delete('tb_po_dtl');
    }

    public function delete_po_opt_dtl($id_po_dtl)
    {
        $this->db->where('id_po_dtl', $id_po_dtl);
        $this->db->delete('tb_po_opt_dtl');
    }    


    public function insert_header_incoming($code_incoming, $id_po, $id_suppliers, $status_incoming)
    {

        $data = array(
            'code' => $code_incoming,
            'id_po' => $id_po,
            'id_suppliers' => $id_suppliers,
            'status_incoming' => $status_incoming,
            'date_create' => current_datetime()
        );

        $this->db->insert('tb_incoming_hdr', $data);
        $this->db->insert_id();
        return $this->db->insert_id();
    }

    public function insert_detail_incoming($id_incoming, $id_product, $qty, $id_product_lokasi_source, $id_product_lokasi_destination)
    {

        $data = array(
            'incoming_hdr_id' => $id_incoming,
            'id_product' => $id_product,
            'qty' => $qty,
            'status' => 'Available',
            'id_product_lokasi_source' => $id_product_lokasi_source,
            'id_product_lokasi_destination' => $id_product_lokasi_destination
        );

        $this->db->insert('tb_incoming_dtl', $data);
    }

    public function update_code_po($id_po, $code_po_lama, $code_po)
    {

        $data = [
            'code_po' => $code_po,
            'code_quotation' => $code_po_lama
        ];

        $this->db->where('id_po', $id_po);
        $this->db->update('tb_po_hdr', $data);
    }

    public function mata_uangs()
    {
        return $this->db->get('m_mata_uang');
    }

    public function data_lokasi()
    {
        return $this->db->get('m_product_lokasi');
    }
}

/* End of file Mmaster.php */