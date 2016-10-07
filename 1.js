function divide_table( num_devide_str ) {
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    if( !isNumeric( num_devide_str ) ) {
        alert("Введите число!");
        return;
    }

    var TempTD = function() {
        this.f_empty = true,
        this.td = undefined,
        this.isEmpty = function() {
            return this.f_empty;
        },
        this.set = function( set_td ) {
            this.td = set_td;
            this.f_empty = false;
        },
        this.get = function() {
            return this.td;
        }
    };
    
    var TempTable = function( set_row_count, set_col_count ) {
        this.col_count = set_col_count,
        this.table = [],
        this.setTD = function( num_row, num_col, set_td ) {
            this.table[ num_row ][ num_col ].set( set_td );
        },
        this.getTD = function( num_row, num_col ) {
            return this.table[ num_row ][ num_col ].get();
        },
        this.isEmptyTD = function( num_row, num_col ) {
            return this.table[ num_row ][ num_col ].isEmpty(); 
        }

        for( var r = 0; r < set_row_count; r ++ ) {
            this.table[ r ] = [];
            for( var c = 0; c < set_col_count; c ++ ) {                
                this.table[ r ][ c ] = new TempTD();
            }
        }        
    };
    
    var source_table = document.querySelector("table");

    var head = source_table.querySelector("thead");
    var all_body_tr =  source_table.querySelectorAll( "tbody>tr" );
    
    var max_count_td = 0;
    var all_td_first_str = head.querySelectorAll( "tr:first-child>td" );
    for( var i = 0; i < all_td_first_str.length; i ++ ) {
        var colspan = all_td_first_str[ i ].getAttribute("colspan") - 0;
        if( colspan > 1 )  max_count_td += colspan;
        else max_count_td ++;
    }

    var temp_table = new TempTable( all_body_tr.length, max_count_td );

    for( var i = 0; i < all_body_tr.length; i ++ ) {
        var all_td = all_body_tr[ i ].querySelectorAll( "td" );
        var num = 0;
        for( var n = 0; n < max_count_td; n ++ ) {
            if( temp_table.isEmptyTD( i, n ) ) 
            {
                var rs = all_td[ num ].getAttribute("rowspan") - 0;
                var cs = all_td[ num ].getAttribute("colspan") - 0;
                if( rs <= 1 ) {
                    temp_table.setTD( i, n, all_td[ num ].cloneNode(true) );   
                    if( cs > 1 ) n += (cs - 1);
                } else {
                    if( rs > 1 ) {
                        for( var m = 0; m < rs; m ++ ) {
                            var paste_td = all_td[ num ].cloneNode(true);
                            paste_td.setAttribute("rowspan", ( rs - m ) );
                            temp_table.setTD( (i + m), n, paste_td );
                        }
                    }
                    if( cs > 1 ) n += ( cs - 1 );
                }
                num ++;
            } else {
                var cs = temp_table.getTD( i, n ).getAttribute("colspan") - 0;
                if( cs > 1 ) n += ( cs - 1 );
            }
        }
    }

    function removeAllChildren( dom_obj ) {
        while (dom_obj.firstChild) 
            dom_obj.removeChild(dom_obj.firstChild);
    }

    function create_table( css_selector, source_table ) {
        var new_table = source_table.cloneNode(true);
        removeAllChildren( new_table.querySelector( "tbody" )  );
        var dom_obj_for_paste = document.querySelector( css_selector );
        removeAllChildren( dom_obj_for_paste );
        dom_obj_for_paste.appendChild( new_table );
        return new_table;
    }    

    var new_tables = create_table( "#div1", source_table );

    for( var k = 0; k < all_body_tr.length; k ++ ) {
        var tr_paste = all_body_tr[ k ].cloneNode(true);

        if( k != num_devide_str ) {
            new_tables.appendChild( tr_paste );
        }
        else {  
            new_tables = create_table( "#div2", source_table );

            removeAllChildren( tr_paste );                  
            for( var n = 0; n < max_count_td; n ++ ) {
                if( !temp_table.isEmptyTD( k, n ) ) {
                    tr_paste.appendChild( temp_table.getTD( k, n ).cloneNode(true) );   
                } 
            }
            new_tables.appendChild( tr_paste );
        }
    }   
}