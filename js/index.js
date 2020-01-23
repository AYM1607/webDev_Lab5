let prevPageToken;
let nextPageToken;
let search;

function performSearch(term, pageToken) {
  const baseYouTubeLink = "https://www.youtube.com/watch?v=";
  $.ajax({
    url: "https://www.googleapis.com/youtube/v3/search",
    data: {
      key: "AIzaSyBHJzlo2AUWvXizfBwshA47oNSQk2fPYw8",
      part: "id,snippet",
      maxResults: 10,
      q: term,
      pageToken: pageToken
    },
    success: response => {
      console.log(response);
      prevPageToken = response.prevPageToken;
      nextPageToken = response.nextPageToken;

      const resultsContainer = $("#results");
      $(resultsContainer).empty();

      response.items.forEach(video => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const thumbnailUrl = video.snippet.thumbnails.high.url;
        const videUrl = baseYouTubeLink + videoId;

        const imageElement = $(`
            <img class="thumb" src=${thumbnailUrl} />
        `);
        $(imageElement).on("click", event => {
          event.preventDefault();
          window.location.href = videUrl;
        });
        const videoContainer = $(`
            <div class="video-container">
                <a href="${videUrl}">${title}</a>
            </div>
        `);
        $(videoContainer).append(imageElement);
        $(resultsContainer).append(videoContainer);

        if (prevPageToken) {
          $("#previousButton").show();
        } else {
          $("#previousButton").hide();
        }

        if (nextPageToken) {
          $("#nextButton").show();
        } else {
          $("#nextButton").hide();
        }
      });
    },
    error: error => {
      console.log(error);
    }
  });
}

function watchForm() {
  $("#termForm").on("submit", event => {
    event.preventDefault();
    const searchText = $("#termInput").val();
    search = searchText;
    performSearch(search);
  });
}

function watchNext() {
  $("#nextButton").on("click", event => {
    event.preventDefault();
    performSearch(search, nextPageToken);
    window.scrollTo(0, 0);
  });
}

function watchPrevious() {
  $("#previousButton").on("click", event => {
    event.preventDefault();
    performSearch(search, prevPageToken);
    window.scrollTo(0, 0);
  });
}

function init() {
  $("#previousButton").hide();
  $("#nextButton").hide();
  watchForm();
  watchNext();
  watchPrevious();
}

init();
