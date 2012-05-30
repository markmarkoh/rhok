if (!Modernizr.csstransforms)
  throw new Error("GTFO");

var callback = function(e) {
  //this callback fires after every css transition!!!!
  var target = e.target || e.explicitOriginalTarget; //webkit || firefox
  if (!$(target).is($(this.element)))
    return;

  this._enter(this.index);
  for (var i = 0; i < this.slides.length; i++) {
    if (i == this.index)
      continue;
    $(this.slides[i]).css('visibility', 'hidden');
    $(this.slides[i]).find('input').attr('disabled', true);
  }
};
var swipe = new Swipe(document.getElementById('content'), {
  speed: 800,
  callback: callback
});
//augment swipe with enter/exit functions
swipe.enter = [];
swipe.exit = [];
swipe._next = swipe.next;
swipe._prev = swipe.prev;
swipe._slide = swipe.slide;
swipe._enter = function(index) {
  if (this.enter.length > index && typeof this.enter[index] == 'function')
    return this.enter[index]();
  return true;
};
swipe._exit = function(index) {
  if (this.exit.length > index && typeof this.exit[index] == 'function')
    return this.exit[index]();
  return true;
};
swipe.slide = function(index, duration) {
  this.transition(this.index, index, duration);
};
swipe.next = function() {
  if (this._exit(this.index) === false)
    return;
  this.transition(this.index, this.index + 1);
};
swipe.prev = function() {
  this.transition(this.index, this.index - 1);
};
swipe.transition = function(old_slide, new_slide, duration) {
  for (var i = 0; i < this.slides.length; i++) {
    $(this.slides[i]).css('visibility', 'visible');
    $(this.slides[i]).find('input').attr('disabled', false);
  }
  this._slide(new_slide, duration);
};

var the_form = $('#the_form');
var name_next_button = $('#name_next_button');
var skills_next_button = $('#skills_next_button');
var finish_button = $('#finish_button');

var summary_name = $('#summary_name');
var summary_skills = $('#summary_skills');

var person_name = $('#name');
var skills = $('#skills');
var skill_name = $('#skill_name');

var finished_images = $('#finished_images');

var skills_data = ['php', 'python', 'ruby', 'java', 'c', 'c++', 'javascript', 'svg', 'graphic design', 'kicking ass', 'html', 'css', 'xml', 'json'];
var finished_image_names = ['badass.jpeg', 'hack_all_things.jpg', 'not_bad.jpeg', 'pbj_time.gif', 'youre_the_man.jpg'];

function add_skill(skill, selected) {
  if (skill.length <= 0)
    return;
  selected = (selected === undefined) ? false : true;

  var element = $('<div>').addClass('skill');
  element.data('skill', skill);
  element.append($('<div>').addClass('front').html(skill));
  element.append($('<div>').addClass('back').html(skill));
  if (selected)
    element.addClass('selected');
  skills.prepend(element);
}
function reset_name() {
  person_name.data('defaultState', true);
  person_name.val('enter your name');
}
function reset_skill_name() {
  skill_name.data('defaultState', true);
  skill_name.val('enter a new skill');
}
function reset_skills() {
  reset_skill_name();
  $('#skills_tile .selected').removeClass('selected');
}
function flash_person_name() {
  person_name.addClass('red');
  window.setTimeout(function() {
    person_name.removeClass('red');
  }, 1100);
}

reset_name();
reset_skills();
for (var i in skills_data) {
  add_skill(skills_data[i]);
}

for (var i in finished_image_names) {
  finished_images.append($('<img>').attr('src', 'images/' + finished_image_names[i]).addClass('hidden'));
}

swipe.exit[1] = function() {
  person_name.blur();
};

swipe.exit[2] = function() {
  summary_name.html(person_name.val());
  summary_skills.html('');
  var selected_skills = $('#skills_tile .selected');
  if (selected_skills.length == 0) {
    summary_skills.addClass('skills-empty');
    summary_skills.html('Boo. No skills.');
  }
  else {
    summary_skills.removeClass('skills-empty');
    selected_skills.each(function(index, item) {
      summary_skills.append($(item).clone());
    });
  }
};

swipe.exit[3] = function() {
  finished_images.find('img').addClass('hidden');
  var img_num = Math.floor(Math.random() * finished_image_names.length);
  finished_images.find('img:eq(' + img_num + ')').removeClass('hidden');
};

var signup_success = function(json, status, xhr) {
  finish_button.removeClass('pulse-orange');
  if (!json.response.success) {
    signup_error(json.error, status, xhr);
    return;
  }
  swipe.next();
  reset_name();
  reset_skills();
  window.setTimeout(function() {
    swipe.slide(0);
  }, 3500);
};

var signup_error = function(error, status, xhr) {
  console.log('shit.');
  finish_button.removeClass('pulse-orange');
};

finish_button.bind('click', function() {
  if (person_name.data('defaultState')) {
    //TODO ability to attach one-time callback to this slide
    swipe.slide(1);
    flash_person_name();
    return;
  }

  finish_button.addClass('pulse-orange');
  var skills_str = '';
  skills.find('.selected').each(function(index, item) {
    skills_str += $(item).data('skill').replace(';', '') + ';';
  });
  if (skills_str.length > 0)
    skills_str = skills_str.slice(0, -1);

  $.ajax({
    url: 'signup.php',
    type: 'post',
    dataType: 'json',
    data: 'name=' + person_name.val() + '&skills=' + skills_str,
    success: signup_success,
    error: signup_error
  });
});

person_name.bind('focus', function() {
  if (person_name.data('defaultState')) {
    person_name.val('');
    person_name.data('defaultState', false);
  }
});
person_name.bind('blur', function() {
  if (person_name.val() == '')
    reset_name();
});
skill_name.bind('focus', function() {
  if (skill_name.data('defaultState')) {
    skill_name.val('');
    skill_name.data('defaultState', false);
  }
});
skill_name.bind('blur', function() {
  if (skill_name.val() == '')
    reset_skill_name();
});

person_name.bind('keyup', function(e) {
  if (e.keyCode == 13) {
    swipe.next();
    return false;
  }
});
skill_name.bind('keyup', function(e) {
  if (e.keyCode == 13) {
    //skills_next_click();
    var skill = skill_name.val();
    if (skills_data.indexOf(skill) < 0)
      add_skill(skill, true, true);
    skill_name.val('');
    return false;
  }
});

$('input[type=button].back').bind('click', function() {
  swipe.prev();
});
$('input[type=button].next').bind('click', function() {
  swipe.next();
});

skills.on('click', '.skill', null, function() {
  $(this).toggleClass('selected');
});
