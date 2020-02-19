import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView
} from 'react-native';
import Voice from 'react-native-voice';
import YouTube from 'react-native-youtube';
let apiKey = "AIzaSyCXpMcYPoOAX6h7TiFkSig77TEWB8Ft1sk"

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      results: "",
      youtubeResults: [],
      videoID: '',
      mic: true,
      videoList: false,
      currentVideoID: "",
      searchingResult: "",
      youtubeVideo: false,
      result: false
    }

    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;

  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

 

  onSpeechPartialResults = e => {
    // eslint-disable-next-line
    this.setState({
      partialResults: e.value,
    });
  };

  onSpeechResults = e => {
    this.getAPIData(e.value[0])
    this.setState({
      searchingResult: e.value[0],
    });
  };


  getAPIData = text => {
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${text}&key=${apiKey}`)
      .then(res => res.json())
      .then(results => {
        console.log(results)
        this.setState({ youtubeResults: results.items, youtubeVideo: true ,currentVideoID : results.items[0].id.videoId})
      })

  }


  _startRecognizing = async () => {
    this.setState({ result: true, videoList: false, youtubeVideo: false, searchingResult: " " })
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  _onPressVideoList = (videoID) => {
    this.setState({ videoID: videoID })
  }

  _renderItems = (ele) => {

    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ currentVideoID: ele.id.videoId, youtubeVideo: true, videoList: false })
        }}
      >
        <View style={styles.videoStyle}>
          <Image
            style={styles.videoImagecontainer}
            source={{ uri: ele.snippet.thumbnails.high.url }}
          />
          <View style={styles.textStyle}>
            <Text
              style={{ marginHorizontal: 10 ,fontWeight: 'bold' }}
              numberOfLines={2}
            >
              {ele.snippet.title}
            </Text>
            <Text
              style={{ marginHorizontal: 10 }}
              numberOfLines={2}
            >
              {ele.snippet.description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>



    )
  }


  render() {

    return (
      <View

        style={{ flex: 1, backgroundColor: "#ffffe6" }}
      >

        {
          this.state.mic ?
            <View>
              <Text
                style={{ justifyContent: "center", textAlign: "center", padding: 30, fontSize: 18 }}
              >
                Tab On Mic for Search ....!!!
                </Text>
              <TouchableOpacity
                onPress={this._startRecognizing}
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <Image
                  style={styles.imageContainer}
                  source={require('./Image/microphone.png')}
                />
              </TouchableOpacity>

              {
                this.state.result ?
                  <Text
                    style={{ justifyContent: "center", textAlign: "center", padding: 30, fontSize: 24, fontWeight: "bold" }}
                  >Results for "{this.state.searchingResult}" </Text>
                  :
                  null
              }

            </View>
            :
            null
        }

        {/* {
          this.state.videoList ?
              <FlatList
                data={this.state.youtubeResults}
                renderItem={({ item }) => this._renderItems(item)}
                keyExtractor={item => item.id.videoId}
              />
            :
            null
        } */}


        {
          this.state.youtubeVideo ?
            <YouTube
              apiKey={apiKey}
              videoId={this.state.currentVideoID} 
              style={{ alignSelf: 'stretch', height: 300, width: "100%" }}
              resumePlayAndroid={false}
              play={true}
              fullscreen={false}
            />
            :
            null



        }
      </View>


    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center"
  },
  imageContainer: {
    width: 200,
    height: 200

  },
  videoImagecontainer: {
    width: 130,
    height: 70
  },
  videoStyle: {
    padding: 10,
    flexDirection: "row",
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
    marginHorizontal: 10,
  },
  textStyle: {
    flex:1,
    flexDirection: "column",
    width:500
  }

});
