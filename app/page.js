"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";

import classNames from "classnames";

export default function Home() {
  const [results, setResults] = useState([]);

  const formik = useFormik({
    initialValues: {
      channels: "",
    },
    onSubmit: async () => {
      toast.promise(search(), {
        loading: "Converting...",
        success: <b>Convert completed!</b>,
        error: <b>Could not convert</b>,
      });
    },
    validationSchema: yup.object({
      channels: yup.string().trim().required("Channels is required"),
    }),
  });

  const search = async () => {
    const channels = formik.values.channels
      .split(/[\n;]/)
      .map((channel) => channel.trim())
      .filter((channel) => channel.length > 0)
      .map((channel) => channel.toLowerCase());

    const results = await Promise.all(
      channels.map(async (channel, index) => {
        const response = await fetch(`/api/convert?q=${channel}`);
        if (response.status !== 200) {
          toast.error(`Could not find channel ${channel}`);
          return { index: index + 1, channel, id: "Not found" };
        }

        const { channels: id } = await response.json();
        let channelId = id;

        if (id.length > 1) {
          toast.error(
            `Found ${id.length} channels for ${channel}. Using first result.`
          );
          channelId = id[0];
        }

        return { index: index + 1, channel, id: channelId };
      })
    );

    formik.resetForm();
    setResults(results);
  };

  const copyToClipboard = (text) => {
    const url = "https://www.youtube.com/channel/";
    navigator.clipboard.writeText(url + text);
    toast.success("Copied to clipboard");
  };

  const exportCSV = () => {
    results.unshift({ index: "Index", channel: "Channel", id: "Channel ID" });

    const csv = results
      .map((result) => {
        `${result.index},${result.channel},${
          result.id !== "Not found"
            ? "https://www.youtube.com/channel/" + result.id
            : result.id
        }`;
      })
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "YouTube_Channel_ID_Finder.csv");
    link.textContent = "Export CSV";
    link.click();
  };

  const faq = [
    {
      question: "What is a YouTube Channel ID?",
      answer:
        "Every channel on YouTube has a unique Channel ID. This is used by YouTube as a unique identifier for your channel. When you first get started on YouTube, you will see that the link to your YouTube channel includes your channel ID.",
    },
    {
      question: "Why do I need a YouTube Channel ID?",
      answer:
        "There are certain tasks the require you to know a YouTube Channel ID. For example, you may need to know a YouTube Channel ID if you are making use of Google’s YouTube API.",
    },
    {
      question: "What is a YouTube username?",
      answer:
        "YouTube usernames come in two forms. Firstly, you will not gain a YouTube username in your YouTube URL until you gain 100 subscribers. When you do, you can choose a YouTube username that will be used in your YouTube URL. Secondly, you can create a custom channel name that will be displayed on your channel page. This is not the same as your YouTube username.",
    },
    {
      question: "What is a YouTube legacy username?",
      answer:
        "There is one more type of YouTube username which you might see on YouTube. Certain users with very old channels may have a URL that includes the /user/ item. It is no longer possible to get a YouTube URL which includes the /user/ item, as they are now discontinued and considered legacy URLs by YouTube.",
    },
    {
      question: "What is a YouTube handle?",
      answer:
        "In 2022 YouTube has introduced a feature called YouTube handles. YouTube handles work in a similar way to other social media platform handles. A YouTube handle always begins with a @ sign, and you can now ‘tag’ other channels in any YouTube title, comment or YouTube short, simply by typing out there @ handle. The YouTube @ handle acts as a direct link to that channel, also providing notifications when a user is tagged with their @ handle.",
      big: true,
    },
    {
      question: "How do I find my YouTube Channel ID?",
      answer:
        "You can find your YouTube Channel ID in two ways. Firstly, you can use our free YouTube Channel ID Finder tool. Secondly, you can find your YouTube Channel ID by following these steps:",
      steps: [
        "Sign in to YouTube.",
        "Click on your profile picture in the top right corner.",
        "Click on YouTube Studio.",
        "Click on Settings.",
        "Click on Channel.",
        "Your YouTube Channel ID will be displayed under your channel name.",
      ],
      big: true,
    },
  ];

  return (
    <main className="bg-white">
      {/* Hero */}
      <div className="relative min-h-screen px-6 isolate pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 overflow-hidden -top-40 -z-10 transform-gpu blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="max-w-2xl py-32 mx-auto sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              YouTube Channel ID Finder
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Easily convert YouTube usernames to channel IDs with our free
              online tool. Find the unique identification code for any YouTube
              channel, enabling you to access valuable insights and data.
              Discover the Channel ID Finder and streamline your YouTube
              analytics today!
            </p>
            <div className="flex items-center justify-center mt-10 gap-x-6">
              <a
                href="#converter"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </a>
              <a
                href="https://developers.google.com/youtube/v3"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>

      {/* Form & results */}
      <section
        className="relative z-[1] py-8 lg:py-12 text-gray-600"
        id="converter"
      >
        <div className="w-[calc(100%_-_2.5rem)] lg:w-[calc(100%_-_4rem)] mx-auto max-w-lg md:max-w-3xl lg:max-w-5xl">
          <div className="mb-8 lg:mb-12">
            <h2 className="text-4xl">
              YouTube UserName to Channel ID converter
            </h2>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <fieldset className="mb-5 lg:mb-8">
              <legend className="mb-3 text-lg text-contrast-higher">
                Enter a YouTube username or list of usernames
              </legend>

              <div className="grid grid-cols-12 gap-3 lg:gap-5">
                <div className="col-span-12">
                  <textarea
                    className="appearance-none bg-white border border-gray-300 min-h-[2.5em] py-2 px-3 rounded-md text-[1em] leading-tight transition duration-200 outline-none placeholder:opacity-100 placeholder:text-gray-400 focus-within:border-indigo-700 w-full"
                    id="channels"
                    name="channels"
                    placeholder="https://www.youtube.com/@username"
                    value={formik.values.channels}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  ></textarea>
                  {formik.errors.channels && (
                    <div
                      className="bg-red-600/20 p-2 lg:p-3 rounded text-sm lg:text-base text-gray-900 mt-1.5 lg:mt-2"
                      role="alert"
                    >
                      <p>{formik.errors.channels}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1.5 lg:mt-2">
                    separate multiple usernames with ; or newline
                  </p>
                </div>
              </div>
            </fieldset>
            <div>
              <button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Convert Username
              </button>
            </div>
          </form>

          {results.length > 0 && (
            <div className="mt-8 lg:mt-12">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Results</h3>
                <button
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={exportCSV}
                >
                  Export CSV
                </button>
              </div>
              <div className="relative mt-4 overflow-auto">
                {results.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-xs font-bold tracking-wider text-left text-gray-500 uppercase">
                          #
                        </th>
                        <th className="px-3 py-2 text-xs font-bold tracking-wider text-left text-gray-500 uppercase">
                          Channel Name
                        </th>
                        <th className="px-3 py-2 text-xs font-bold tracking-wider text-left text-gray-500 uppercase">
                          Channel ID
                        </th>
                        <th className="px-3 py-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((item) => (
                        <tr key={item.index}>
                          <td className="px-3 py-2 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                            {item.index}
                          </td>

                          <td className="px-3 py-2 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                            {item.channel}
                          </td>
                          <td className="px-3 py-2 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                            {item.id ? item.id : "Not Found"}
                          </td>
                          <td className="px-3 py-2 text-xs font-semibold tracking-wider text-center text-gray-500 uppercase">
                            <button
                              className="disabled:opacity-75 disabled:cursor-not-allowed inline-block rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              onClick={() => copyToClipboard(item.id)}
                              disabled={!item.id}
                            >
                              Copy
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No results</p>
                )}
              </div>
            </div>
          )}
        </div>
        <Toaster />
      </section>

      {/* FAQ */}
      <section className="relative z-[1] py-8 lg:py-12 text-gray-600">
        <div className="w-[calc(100%_-_2.5rem)] lg:w-[calc(100%_-_4rem)] mx-auto max-w-lg md:max-w-3xl lg:max-w-5xl">
          <div className="mb-8 lg:mb-12">
            <h2 className="text-4xl text-center">Questions &amp; Answers</h2>
          </div>

          <ol className="grid grid-cols-12 text-points text-points--counter gap-y-8 lg:gap-12">
            {faq.map((item, index) => {
              const liClass = classNames({
                "text-points__item col-span-12": true,
                "lg:col-span-6": !item.big,
              });
              return (
                <li key={index} className={liClass}>
                  <div className="text-points__text">
                    <h3 className="mb-1 text-xl">
                      <span
                        className="text-points__bullet after:bg-gray-100 after:rounded-full after:font-semibold after:text-[14px] after:text-gray-500"
                        aria-hidden="true"
                      ></span>
                      {item.question}
                    </h3>

                    <p className="text-sm text-gray-500">{item.answer}</p>

                    {item.steps && (
                      <ol className="mt-4 text-sm text-gray-500 list-decimal list-inside">
                        {item.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </main>
  );
}
