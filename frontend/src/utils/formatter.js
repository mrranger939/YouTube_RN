// Helper function to format views, duration, and upload time

export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  return `${minutes} minute${minutes > 1 ? "s" : ""}`;
};

export const formatViews = (views) => {
  // console.log("the no of views is : ",views," the type is : ",typeof(views)) //for testing purpose
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + "M"; // Convert to 'M' format
  }
  if (views >= 1000) {
    if (views >= 10000) {
      return Math.floor(views / 1000) + "K"; // Convert to 'k' format
    }
    return (views / 1000).toFixed(1) + "K"; // Convert to 'k' format
  }
  return views.toString(); // Otherwise, just return the views as is
};

export const formatUploadTime = (uploadTime) => {
  const diff = Math.abs(new Date() - new Date(uploadTime)) / 1000;
  if (diff < 60) {
    var d = Math.floor(diff / 1);
    return d == 1 ? `${d} second ago` : `${d} seconds ago`;
  }
  const minutesAgo = Math.floor(diff / 60);
  if (minutesAgo < 60) {
    return minutesAgo == 1
      ? `${minutesAgo} minute ago`
      : `${minutesAgo} minutes ago`;
  } else if (minutesAgo < 1440) {
    const hoursAgo = Math.floor(minutesAgo / 60);
    return hoursAgo == 1 ? `${hoursAgo} hour ago` : `${hoursAgo} hours ago`;
  } else if (minutesAgo < 10080) {
    const daysAgo = Math.floor(Math.floor(minutesAgo / 60) / 24);
    return daysAgo == 1 ? `${daysAgo} day ago` : `${daysAgo} days ago`;
  } else if (minutesAgo < 43800) {
    const weeksAgo = Math.floor(
      Math.floor(Math.floor(minutesAgo / 60) / 24) / 7,
    );
    return weeksAgo == 1 ? `${weeksAgo} week ago` : `${weeksAgo} weeks ago`;
  } else if (minutesAgo < 525600) {
    const monthsAgo = Math.floor(
      Math.floor(Math.floor(Math.floor(minutesAgo / 60) / 24) / 7) / 4,
    );
    return monthsAgo == 1
      ? `${monthsAgo} month ago`
      : `${monthsAgo} months ago`;
  } else {
    const yearsAgo = Math.floor(
      Math.floor(
        Math.floor(Math.floor(Math.floor(minutesAgo / 60) / 24) / 7) / 4,
      ) / 12,
    );
    return yearsAgo == 1 ? `${yearsAgo} year ago` : `${yearsAgo} years ago`;
  }
};
