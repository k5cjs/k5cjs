### Input

<!-- tabs:start -->

#### **Scss Tailwind**

```scss
.field {
  @apply
    w-full
    m-0
    py-2
    px-1;
}

input {
  @apply
    w-full
    m-0
    p-0
    border-none
    box-border
    bg-transparent
    outline-none
    placeholder-slate-400
    truncate;

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    @apply
      [background:transparent]
      bg-[#fff]
      shadow-inner
      shadow-transparent
      transition-colors
      duration-[5000s];
  }

  /**
   * for removing the highlight on iOS
   */
  -webkit-tap-highlight-color: transparent;

  &:disabled {
    /**
     * for removing opacity on disabled inputs in Safari
     */
    @apply opacity-100;
  }
}

```

#### **Scss**

```scss
.field {
  width: 100%;
  margin: 0;
  padding: 0.5rem 0.25rem;
}

input {
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  border-style: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: transparent;
  outline: 0;

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 6%);
    background: transparent;
    background-color: #fff;
    transition-duration: 5000s;
    transition-property: background-color, border-color, color, fill, stroke;
  }

  /**
   * for removing the highlight on iOS
   */
  -webkit-tap-highlight-color: transparent;

  &:disabled {
    /**
     * for removing opacity on disabled inputs in Safari
     */
    opacity: 1;
  }
}
```

<!-- tabs:end -->
