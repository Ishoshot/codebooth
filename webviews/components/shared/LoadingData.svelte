<script lang="ts">
  export let message: string;
</script>

<div class="wrapper">
  <div class="image-container">
    <div id="image" />
  </div>
  <h3 class="message">
    {message}
  </h3>
</div>

<style scoped>
  .wrapper {
    display: flex;
    flex-direction: column;
    height: 500px;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .image-container {
    background-color: #fff;
    padding: 30px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    text-align: center;
  }

  #image {
    background: url("https://res.cloudinary.com/oluwatobi/image/upload/v1616838857/codebooth/codebooth-loading_vrymgb.gif");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    width: 100%;
    height: 100%;
  }

  .message {
    text-align: center;
    margin-top: 30px;
  }
</style>
