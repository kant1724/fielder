function ajax(url, input_data, gubun, method) {
	$.ajax(url, {
		type: method, 
        data: input_data,
        async: false,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        success: function (data, status, xhr) {
        	if (gubun == "select_board_list") {
        		select_board_list_callback(data);
            } else if (gubun == "get_reply_list") {
            	get_reply_list_callback(data);
            } else if (gubun == "add_reply") {
            	add_reply_callback(data);
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
        	if(jqXhr.status==404) {
        		alert(textStatus);
            }
        }
    });
}

function get_images() {
	ajax('/select_board_list', {"board_num" : ""}, 'select_board_list', 'POST');
}

var last_board_num = '';
function select_board_list_callback(data) {
	var ret_list = eval(data['res']);
	for (var i = 0; i < ret_list.length; ++i) {
		var board_num = ret_list[i]['BOARD_NUM'];
		$('<div id="each' + board_num + '" class="each-div"><img class="each-image" src="' + ret_list[i]['IMAGE_PATH'] + '" /></div>').appendTo($('.body-inner'));			
	}	
	for (var i = 0; i < ret_list.length; ++i) {
		var board_num = ret_list[i]['BOARD_NUM'];
		last_board_num = board_num;
		$('<div id="' + board_num + '" class="board-num"></div>').appendTo($('#each' + board_num));
		$('<p><div><img class="clap-image" src="res/clap.png" /></div>').appendTo($('#each' + board_num));
		var msg = "칭찬해 " + ret_list[i]['COMPLIMENT_CNT'] + "개";
		$('<a class="each-msg">' + msg + '</a>').appendTo($('#each' + board_num));
		$('<div class="border-div" />').appendTo($('#each' + board_num));
		var write_reply = "&nbsp;&nbsp;답글달기";
		$('<p><a id="reply' + i + '" class="write-reply">' + write_reply + '</a>').appendTo($('#each' + board_num));
		$('<div class="reply-text"></div>').appendTo($('#each' + board_num));
		get_reply_list(board_num);
	}
	$(".write-reply").unbind();
	$(".write-reply").click(function() {
		var rt = $(this).parent().parent().find('.reply-text-input');
		if (rt.prop('class') != null) {
			rt.remove();
		} else {
			var reply_text = $(this).parent().parent().find('.reply-text');
			reply_text.append('<input class="reply-text-input" type="text">');
			rt = $(this).parent().parent().find('.reply-text-input');
			var bn = $(this).parent().parent().find('.board-num');
			var board_num = bn.prop('id');
			$(rt).keypress(function(event) {
				if (event.which == 13) {
					var message = $(this).val();
					add_reply(board_num , message, "SSB");
					rt.remove();
				}
			});
		}
	});
	
	$('.loading-icon').hide();
	if (ret_list.length > 0) {
		get_more = true;
	}
}
var get_more = true;
function get_reply_list(board_num) {
	ajax('/get_reply_list', {"board_num" : board_num}, 'get_reply_list', 'POST');
}

function get_reply_list_callback(data) {	
	var reply_list = eval(data['res']);
	if (reply_list.length > 0) {
		var board_num = reply_list[0]["BOARD_NUM"];
		var ele = $('.body-inner').find('#' + board_num);
		var reply = ele.parent().find('.reply');
		if (reply.prop('class') != null) {			
			reply.empty();
			reply.remove();
		}
		$('<div class="reply">').appendTo(ele.parent());
		for (var i = 0; i < reply_list.length; ++i) {
			$('<p><div class="each-reply"><a class="reply-writer">' + reply_list[i]["RGSN_USER"] + '</a>&nbsp;:&nbsp;<a id="reply_list' + i + '" class="reply-content">' + reply_list[i]['REPLY_MSG'] + '</a></div>').appendTo(ele.parent().find('.reply'));
		}
		$('</div>').appendTo(ele.parent());
	}
}

function add_reply(board_num, message, rgsn_user) {
	ajax('/add_reply', {"board_num" : board_num, "message" : message, "rgsn_user" : rgsn_user}, 'add_reply', 'POST');
}

function add_reply_callback(data) {
	alert("답글이 등록되었습니다.");
	ajax('/get_reply_list', {"board_num" : data}, 'get_reply_list', 'POST');	
}

$(document).ready(function() {
	$('.body-inner').empty();
	$('img').lazyload({event: "lazyload", effect : 'fadeIn', effectTime : 1000}).trigger("lazyload");
	get_images();
	var user_arr = ['이시현', '김민정', '류석호', '김진욱', '손승범'];
	for (var i = 0; i < 5; ++i) {
		$('<div class="user-info"><img class="user-image" src="res/user' + (i + 1) + '.jpg" /><a class="user-name">' + user_arr[i] + '</a></div>').appendTo($('.left-second-div-content'));
	}
	$('<div class="more"><a>. . .</a></div>').appendTo($('.left-second-div-content'));
	$('<a class="my-post-text">타임라인</a>').appendTo($('.my-post'));
	
	$(".add-image").click(function() {
		var w = 1000;
		var h = 700;
		var x = (screen.width - w) / 2;
		var y = (screen.height - h) / 3 - 50;
		window.open('/add_photo', '_blank', 'scrollbars=yes, width=' + w + ', height=' + h + ', left=' + x + ', top=' + y);
	});
	
	$(window).scroll(function() {		
		if (get_more == false) return;		
		if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
			get_more = false;
			$('.loading-icon').show();
			setTimeout(function(){
				ajax('/select_board_list', {"board_num" : last_board_num}, 'select_board_list', 'POST');
			}, 1000);
		}
	});
});
