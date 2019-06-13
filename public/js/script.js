jQuery(function($){

    //To display todo when page loads first time.
    $.ajax({
        type: 'POST',
        url: '/show_todo',
        success: function(result){
            $('.todo_list ul').empty();
            $('.todo_old_list ul').empty();
            let today_date = new Date().toJSON().split('T')[0];
            $.each(result, function(i, res){
                if(res.old_todo){
                    if(today_date === res.creation_date){
                        $('.todo_list ul').append('<li data-id="'+res.id+'"><span class="li-stire">'+res.todo_name+'</span><span class="badge text-success">completed</span></li>');
                    }
                    else{
                        $('.todo_old_list ul').append('<li data-id="'+res.id+'" class="disabled"><span class="li-stire">'+res.todo_name+'</span><span class="badge text-success">completed</span></li>');
                    }
                }
                else{
                    if(today_date === res.creation_date){
                        $('.todo_list ul').append('<li data-id="'+res.id+'"><span>'+res.todo_name+'</span><span class="badge text-danger">incomplete</span></li>');
                    }
                    else{
                        $('.todo_old_list ul').append('<li data-id="'+res.id+'" class="disabled"><span>'+res.todo_name+'</span><span class="badge text-danger">incomplete</span></li>');
                    }
                }
            });
        },
        error: function(){
            alert('Error');
        }
    });

    //Insert todo data into DB and display todo in the list
    $('#form_todo').submit(function(e){
        e.preventDefault();
        let val = $('input[name=todo]').val();
        $.ajax({
            type: 'POST',
            url: '/insert_todo',
            data: {todo : val},
            success: function(data){
                $('input[name=todo]').val('');
                if(data.success){
                    $('#green_bar').fadeIn();
                    $('#green_bar').html(data.success);
                    setTimeout(function(){
                        $('#green_bar').fadeOut();
                    }, 3000);
                    $('.todo_list ul').empty();
                    $('.todo_old_list ul').empty();
                    let today_date = new Date().toJSON().split('T')[0];

                    //Display todo data in the list
                    $.ajax({
                        type: 'POST',
                        url: '/show_todo',
                        success: function(result){
                            $.each(result, function(i, res){
                                if(res.old_todo){
                                    if(today_date === res.creation_date){
                                        $('.todo_list ul').append('<li data-id="'+res.id+'"><span class="li-stire">'+res.todo_name+'</span><span class="badge text-success">completed</span></li>');
                                    }
                                    else{
                                        $('.todo_old_list ul').append('<li data-id="'+res.id+'" class="disabled"><span class="li-stire">'+res.todo_name+'</span><span class="badge text-success">completed</span></li>');
                                    }
                                }
                                else{
                                    if(today_date === res.creation_date){
                                        $('.todo_list ul').append('<li data-id="'+res.id+'"><span>'+res.todo_name+'</span><span class="badge text-danger">incomplete</span></li>');
                                    }
                                    else{
                                        $('.todo_old_list ul').append('<li data-id="'+res.id+'" class="disabled"><span>'+res.todo_name+'</span><span class="badge text-danger">incomplete</span></li>');
                                    }
                                }
                            });
                        },
                        error: function(){
                            alert('Error');
                        }
                    });
                }
                if(data.error){
                    $('#red_bar').fadeIn();
                    $('#red_bar').html(data.error);
                    setTimeout(function(){
                        $('#red_bar').fadeOut();
                    }, 1000);
                }
            },
            error: function(){
                alert('Error');
            }
        });
    });
});