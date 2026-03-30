import Array "mo:core/Array";
import Int "mo:core/Int";
import List "mo:core/List";
import Time "mo:core/Time";
import OutCall "http-outcalls/outcall";

actor {
  type Language = {
    code : Text;
    name : Text;
  };

  type Translation = {
    text : Text;
    fromLang : Text;
    toLang : Text;
    translatedText : Text;
    timestamp : Int;
  };

  let translations = List.empty<Translation>();
  let maxTranslations = 20;

  public shared ({ caller }) func translate(text : Text, fromLang : Text, toLang : Text) : async Text {
    let url = "https://api.mymemory.translated.net/get?q=" # text # "&langpair=" # fromLang # "|" # toLang;
    let responseText = await OutCall.httpGetRequest(url, [], transform); // JSON response as Text

    // The translation parsing is handled in the frontend.
    let translation : Translation = {
      text;
      fromLang;
      toLang;
      translatedText = responseText;
      timestamp = Time.now();
    };

    translations.add(translation);
    let translationsArray = translations.toArray();
    let limitedTranslations = if (translations.size() > maxTranslations) {
      translationsArray.sliceToArray(0, maxTranslations);
    } else {
      translationsArray;
    };

    translations.clear();
    translations.addAll(limitedTranslations.values());
    responseText;
  };

  public shared query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public query ({ caller }) func getRecentTranslations() : async [Translation] {
    translations.toArray();
  };

  public query ({ caller }) func getSupportedLanguages() : async [Language] {
    [
      { code = "en"; name = "English" },
      { code = "es"; name = "Spanish" },
      { code = "fr"; name = "French" },
      { code = "de"; name = "German" },
      { code = "it"; name = "Italian" },
      { code = "pt"; name = "Portuguese" },
      { code = "ru"; name = "Russian" },
      { code = "zh"; name = "Chinese" },
      { code = "ja"; name = "Japanese" },
      { code = "ko"; name = "Korean" },
      { code = "ar"; name = "Arabic" },
      { code = "hi"; name = "Hindi" },
    ];
  };
};
