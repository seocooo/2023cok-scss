"use strict";

/* [SEPTEM] UI Dev Team */
$(function () {
  var thead = '<thead><tr><th>No</th><th>depth2</th><th>depth3</th><th>depth4</th><th>depth etc.</th><th>화면명</th><th>파일명</th><th>년도</th><th>최근수정일</th><th>작업자</th><th>비고</th></tr></thead>';
  $('.pubList table.display caption').after(thead);
  tableNo(); //테이블 넘버링 & date
  dataTable();
  menu();
  dataTableDateFilter();
  colorBox(); //No 클릭시 컬러박스 실행
  overIframe(); //파일명 마우스오버시 아이프레임
  total();
  scrollEvent();
  currentActive();
  imageList();
  matchMenu();
  $('#cboxOverlay').on('click', function () {
    $('html').css('overflow', 'auto');
    console.log('dd');
  });
});
var now = new Date();
var year = now.getFullYear();
var month = now.getMonth() + 1;
if (month < 10) {
  month = "0" + month;
}
var date = now.getDate();
if (date < 10) {
  date = "0" + date;
}
var today = year + '-' + month + '-' + date;
function tableNo() {
  $('.display tbody tr').each(function (e) {
    var path = $(this).find('.path a').attr('href');
    $(this).prepend('<td class="no"><a href="' + path + '" class="colorNo cboxElement">' + (e + 1) + '</a></td>');
    $(this).find('.date').each(function () {
      // let date = $(this).find('span');

      // date.attr('data-date', date.html()).empty();
      // let date = $(this).find('.date span');
      // if( $(this).date > 2 ){
      // 	date.attr('data-date', text).empty();
      // }
      var lastDate = $(this).find(':last').html();
      $(this).prepend('<em>' + lastDate + '</em>');
      var length = $(this).find('span').length;
      if (length > 1) {
        $(this).find('span').each(function (index) {
          $(this).attr('data-date', $(this).html()).empty();
          if (index == length - 1) {
            $(this).addClass('active');
            if ($(this).attr('data-date') == today) {
              $(this).addClass('today');
            }
          }
        });
      } else {
        $(this).find('span').remove();
      }
    });
  });
}
$('.date span').on({
  'mouseenter': function mouseenter() {
    $(this).parent().find('em').text($(this).attr('data-date'));
  },
  'mouseleave': function mouseleave() {
    $(this).parent().find('em').text($(this).parent().find('a:last').attr('data-date'));
  }
});
function dataTable() {
  var dataTables = $('table.display').DataTable({
    "paging": false,
    "info": false,
    "search": false,
    "orderMulti": true,
    "responsive": false,
    "details": false,
    "autoWidth": true
  });
}
function menu() {
  var dataTables = $('table.display').DataTable();
  $('.display').each(function () {
    var bundleTit = $(this).find('caption').text() || $(this).find('.st_uiGuide_tit').text();
    $('.gnb ul').append('<li><span>' + bundleTit + '</span></li>');
  });
  $('.gnb span').on('click', function () {
    var val = $(this).text();
    if (val == '전체보기') {
      $('.display').css('display', 'block');
    } else {
      $('.display').each(function () {
        var bundleTit = $(this).find('caption').text() || $(this).find('.st_uiGuide_tit').text();
        if (bundleTit == val) {
          $(this).css('display', 'block');
        } else {
          $(this).css('display', 'none');
        }
      });
    }
    $(window).scrollTop(0);
    $(this).parent().siblings('li').find('span').removeClass('active');
    $(this).addClass('active');
  });
  var clicking = false;
  var $gnb = $('.gnb');
  var slPos = '';
  var mlPos = '';
  var scrollL = $gnb.scrollLeft();
  $gnb.on('click, mousedown', function (e) {
    clicking = true;
    slPos = e.pageX;
  });
  $(document).on('mouseup', function (e) {
    clicking = false;
    scrollL = $gnb.scrollLeft();
  });
  $gnb.on('mousemove', function (e) {
    if (clicking == false) return;
    mlPos = e.pageX;
    // if( slPos - mlPos > 10) {
    // 	scrollL += 10;
    // }else if( slPos - mlPos < 10) {
    // 	scrollL -= 10;
    // }
    scrollL = scrollL + (slPos - mlPos);
    $gnb.scrollLeft(scrollL);
  });
}
function dataTableDateFilter() {
  var dataTables = $('table.display').DataTable();
  $('.search').prepend('<span class="dataFilter"><input type="date" id="fromDate" placeholder="2018-01-01"> ~ <input type="date" id="toDate" placeholder="' + today + '" value=""></span> ');
  $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
    var min = Date.parse($('#fromDate').val());
    var max = Date.parse($('#toDate').val());
    var targetDate = Date.parse(data[8]); //검색될 셀
    if (isNaN(min) && isNaN(max) || isNaN(min) && targetDate <= max || min <= targetDate && isNaN(max) || targetDate >= min && targetDate <= max) {
      return true;
    }
    return false;
  });
  $('#toDate, #fromDate').on('change', function () {
    //날짜검색
    dataTables.draw();
  });
  $('#tableSearch').on('keyup', function () {
    //검색
    if ($('.cmImages').length > 0) {
      //imgList의 경우
      var keyword = $(this).val();
      var result = $('.name:contains("' + keyword + '")');
      console.log(result.length);
      $('.cmImages ul li').hide();
      $(result).parent('li').show();
    } else {
      dataTables.search(this.value).draw();
      $('.dataTable').show();
      $('.dataTables_empty').parents('.dataTable').hide();
    }
  });
}
;
function colorBox() {
  var colorW = "95%";
  $('#cboxWrapper').append('<div class="resizeBtn"><button value="1600">1600px</button><button value="1024">1024px</button><button value="960">960px</button><button value="800">800px</button><button value="717">717px</button><button value="414">414px</button><button value="375">375px</button><button value="360">360px</button><button value="320">320px</button></div>');
  $('.resizeBtn button').on('click', function () {
    colorW = $(this).attr('value');
    $.colorbox.resize({
      width: colorW,
      height: '90%'
    });
    $(".colorNo").colorbox({
      width: colorW,
      height: "90%"
    }); //reset
    $('.resizeBtn button').removeClass('active');
    $(this).addClass('active');
    return colorW;
  });
  $(".colorNo").colorbox({
    rel: 'iframe',
    iframe: true,
    scalePhotos: true,
    width: colorW,
    height: "90%",
    opacity: .8,
    title: function title() {
      var title = '';
      var pathTxt = $(this).parent().siblings('td:nth-child(7)').text();
      title = '<span class="pathTxt">' + pathTxt + '</span><span class="depthTxt">';
      title += $(this).parents('table').find('caption').text();
      title += ' > ';
      for (var i = 2; i < 7; i++) {
        if ($(this).parent().siblings('td:nth-child(' + i + ')').text() != '') {
          if (i == 2) {
            title += $(this).parent().siblings('td:nth-child(' + i + ')').text();
          } else {
            title += ' > ';
            title += $(this).parent().siblings('td:nth-child(' + i + ')').text();
          }
        } else {
          break;
        }
      }
      title += '</span>';
      var url = $(this).attr('href');
      return '<a href="' + url + '" target="_blank" class="colorBtn">열기</a><span class="">' + title + '</span>';
    }
  });
  $(document).on('cbox_open', function () {
    $('html').css('overflow', 'hidden');
  });
  $(document).on('cbox_closed', function () {
    $('html').css('overflow', '');
  });
  $(document).on('cbox_load', function () {
    $.colorbox.resize({
      width: colorW,
      height: '90%'
    });
    console.log('colorW' + colorW);
  });
}
;
function overIframe() {
  var $body = $('body');
  var $side = $(document).find('.side');
  var prevIframe = $('<iframe class="previewIframe"></iframe>');
  $('.pubList .path a').on('mouseover', function () {
    $body.append(prevIframe);
    var $this = $(this);
    prevIframe.attr('src', $this.attr('href'));
  }).on('mouseout', function () {
    prevIframe.remove();
  });
  $('.pubGuide .path').on('click', function (e) {
    $side.append(prevIframe);
    var $link = $(this).find('a');
    console.log($link);
    prevIframe.attr('src', $link.attr('href'));
  });
}
function total() {
  $(".total").each(function () {
    var sum = 0;
    var sumG = 0;
    var sumMinus = 0;
    var sumMinusG = 0;
    var count = 0;
    var countG = 0;
    $("table").find(".path a").each(function () {
      if ($(this).html() != "") {
        sum++;
      } else {
        sumMinus++;
      }
    });
    $("table").find(".del .path a").each(function () {
      if ($(this).html() != "") {
        sumG++;
      } else {
        sumMinusG++;
      }
    });
    $("table").find(".name").each(function () {
      if ($(this).html() == "") {
        count++;
      }
    });
    $("table").find(".del").each(function () {
      if ($(this).find(".name").html() == "") {
        countG++;
      }
    });
    count = sum - sumG + (sumMinus - sumMinusG) - (count - countG);
    sum = sum - sumG;
    var str = "";
    str += "<span>" + "<strong>" + count + "</strong>" + "/" + sum + "pages" + "</>" + "<em>" + "(" + parseInt(count / sum * 100) + "%" + ")" + "</em>";
    $(this).find("> span").html(str);
  });
}
function scrollEvent() {
  $('.top').on('click', function () {
    $('html').animate({
      scrollTop: 0
    }, 300);
    console.log('화면 맨위로');
  });
}
function currentActive() {
  $('table tr').on('click', function () {
    $('table tr').removeClass('focus');
    $(this).addClass('focus');
  });
}
function matchMenu() {
  $(".display").each(function (i) {
    var _this = $(this);
    $(this).on({
      'mouseenter focusin': function mouseenterFocusin() {
        //var targetName = _this.find('caption').text();
        var bundleTit = _this.find('caption').text() || _this.find('.st_uiGuide_tit').text();
        // console.log(targetName);
        $('.gnb').find('span').each(function () {
          if ($(this).text() == bundleTit) {
            $('.gnb').find('span').removeClass('on');
            $(this).addClass('on');
          }
        });
        return false;
      },
      'mouseleave focusout': function mouseleaveFocusout() {
        //var targetName = _this.find('caption').text();
        $('.gnb').find('span').removeClass('on');
      }
    });
  });
}

//pubImages
function imageList() {
  var target = $('.cmImages li');
  target.each(function () {
    var href = $(this).find('a').attr('href');
    var file = href.split('/').reverse()[0];
    $(this).find('.img img').attr('src', href);
    $(this).find('a').append(file);
    $(this).find('.img').on({
      mouseenter: function mouseenter() {
        $(this).find('img').attr('title', href);
      }
    });
  });
}

// function menuSwiper(){
// 	var swiper = new Swiper('.gnb', {
// 		slidesPerView: "auto",
// 		centeredSlides: true,
// 		pagination: {
// 			el: ".mainSwiperPage",
// 			type: "progressbar",
// 		},
// 		scrollbar: {
// 			el: ".mainAccSwiper .swiper-scrollbar",
// 		},
// 	});
// }