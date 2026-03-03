var trackingManager = (function IIFE($, global) {

  var $trackClass, $progressEl;
  var trackingObject = {};
  var timer = 0;
  var userId = uniqueCourseId = moduleId = null, trackIds;

  function parseHTML() {
    $.each(trackIds, function (index, id) {
      trackingObject[id] = {
        lastAccessedAt: null,
        totalTimeSpent: 0,
        clicked: false
      };
    });
  }

  function fetchAndCompareProgress() {
    data = {
      'unique_course_id': uniqueCourseId,
      'module_id': moduleId,
      'asistencia_id': userId
    };

    sendRequest("../../../../../progreso.php?v=" + new Date().getTime(), data)
      .then(response => {
        if (response) {
          var progressObject = JSON.parse(response.progress_object);
          const progressValue = response.progress;
          $("#porcentajeProgreso").text(progressValue);
          $("#course-progress").html("<strong>" + progressValue + "%</strong>");
          // Force update for any duplicate IDs or shadow DOM issues
          $('[id="course-progress"]').html("<strong>" + progressValue + "%</strong>");
          $(".course-progress-text").html("<strong>" + progressValue + "%</strong>");

          for (let prop in trackingObject) {
            if (progressObject[prop] && progressObject[prop]['clicked']) {
              trackingObject[prop] = { ...progressObject[prop] };
              $(`#${prop}`).removeClass('btn-primary').addClass('read');
            }
          }
        } else {
          $("#porcentajeProgreso").text(0);
          $("#course-progress").html("<strong>0%</strong>");
          $('[id="course-progress"]').html("<strong>0%</strong>");
        }
      })
      .fail(err => { });
  }

  function startTracking(elementId) {
    if (!elementId) {
      return;
    }
    if (trackingObject[elementId]) {
      timer = performance.now();
      trackingObject[`${elementId}`] = {
        ...trackingObject[`${elementId}`],
        lastAccessedAt: +new Date(),
        clicked: true
      };
    }
  }

  function stopTracking(elementId) {
    if (!elementId) {
      return;
    }
    if (trackingObject[elementId]) {
      trackingObject[`${elementId}`] = {
        ...trackingObject[`${elementId}`],
        totalTimeSpent: trackingObject[`${elementId}`].totalTimeSpent + parseInt((performance.now() - timer) / 1000)
      };

      // OPTIMISTIC UI UPDATE: Update UI immediately before server request
      // This calculates progress locally if possible or just marks as read
      $(`#${elementId}`).removeClass('read').addClass('read');

      sendRequest("../../../../../update_progress.php", {
        'unique_course_id': uniqueCourseId,
        'module_id': moduleId,
        'progress_object': JSON.stringify(trackingObject),
        'asistencia_id': userId
      })
        .then(response => {
          if (response && (response.progress !== undefined)) {
            const progressValue = response.progress;
            // Update all progress indicators immediately
            $("#porcentajeProgreso").text(progressValue);
            $("#course-progress").html("<strong>" + progressValue + "%</strong>");
            $('[id="course-progress"]').html("<strong>" + progressValue + "%</strong>");
            $(".course-progress-text").html("<strong>" + progressValue + "%</strong>");
          }
          // Multiple retries to ensure DB update is caught
          setTimeout(function () { fetchAndCompareProgress(); }, 200);
          setTimeout(function () { fetchAndCompareProgress(); }, 1000);
        })
        .fail(err => { });
    }
  }

  function sendRequest(url, data) {
    return $.ajax({
      url: url,
      type: 'POST',
      data: data
    }).then(function (resp) {
      var parsed = resp;
      if (typeof resp === 'string') {
        try {
          parsed = JSON.parse(resp);
        } catch (e) {
          var m = resp.match(/(\{[\s\S]*\})/);
          if (m && m[1]) {
            try { parsed = JSON.parse(m[1]); } catch (e2) { parsed = resp; }
          }
        }
      }
      if (parsed && parsed.progress_object && typeof parsed.progress_object === 'string') {
        try { parsed.progress_object = JSON.parse(parsed.progress_object); } catch (e) { }
      }
      return parsed;
    }, function (jqXHR, textStatus, errorThrown) {
      return $.Deferred().reject(jqXHR, textStatus, errorThrown);
    });
  }

  function init(opts, ...params) {
    userId = params[0];
    uniqueCourseId = params[1];
    moduleId = params[2];
    trackIds = params[3];
    $trackClass = $(opts.trackClass);
    $progressEl = $(opts.progressEl);

    parseHTML();
    fetchAndCompareProgress();
  }

  var publicAPI = {
    init: init,
    startTracking: startTracking,
    stopTracking: stopTracking,
    updateProgress: fetchAndCompareProgress
  };

  return publicAPI;

})(jQuery, window);

// Handle page visibility change events
function handleVisibilityChange() {
  elToTrack = '';
  if (document.visibilityState == "hidden") {
    if (elToTrack) {
      trackingManager.startTracking(elToTrack);
    }
  } else {
    if (elToTrack) {
      trackingManager.stopTracking(elToTrack);
      elToTrack = null;
    }
  }
}