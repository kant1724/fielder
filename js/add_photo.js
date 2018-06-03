function ajax(url, input_data, gubun, method) {
	$.ajax(url, {
		type: method, 
        data: input_data,
        async: false,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        success: function (data, status, xhr) {
        	if (gubun == "get_gallery_list") {
        		get_gallery_list_callback(data);
            } else if (gubun == "register_image") {
            	register_image_callback(data);
            }        	
        },
        error: function (jqXhr, textStatus, errorMessage) {
        	alert(jqXhr.status);
        	if(jqXhr.status==404) {
        		alert(textStatus);
            }
        }
    });
}
var all_done = 0;
$(document).ready(function() {
	$('img').lazyload({event: "lazyload", effect : 'fadeIn', effectTime : 1000}).trigger("lazyload");
	ajax('/get_gallery_list', {}, 'get_gallery_list', 'POST');
});

function get_gallery_list_callback(data) {
	var selected_list = [];
	var file_list = eval(data['file_list']);
	for (var i = 0; i < file_list.length; ++i) {
		var div = '<div class="outer"><div class="gallery"><div class="col-xs-4 col-sm-3 col-md-2 nopad text-center">';			
		var html = div + '<label class="image-checkbox"><img class="img-responsive" src="' + file_list[i] + '"/><input type="checkbox" name="image[]" value="" /></label>' + '</div></div></div>'
		$(html).appendTo($('.container'));
	}
	$(".image-checkbox").on("click", function (e) {
		$(this).toggleClass('image-checkbox-checked');
		var $checkbox = $(this).find('input[type="checkbox"]');
		$checkbox.prop("checked", !$checkbox.prop("checked"));
		var img = $(this).find('img').attr('src');
		if ($checkbox.prop("checked")) {
			selected_list.push(img);
		} else {
			for (var i = 0; i < selected_list.length; ++i) {
				if (selected_list[i] == img) {
					selected_list.splice(i, 1);
				}
			}
		}
		e.preventDefault();
	});
	$(".send-btn").on("click", function (e) {
		all_done = selected_list.length;
		for (var i = 0; i < selected_list.length; ++i) {
			ajax('/register_image', {"image" : selected_list[i]}, 'register_image', 'POST');
		}		
	});
}

function register_image_callback(data) {
	all_done--;
	if (all_done == 0) {
		alert("사진이 등록 되었습니다.");
		opener.$('.body-inner').empty();
		opener.get_images();
		self.close();
	}
}
