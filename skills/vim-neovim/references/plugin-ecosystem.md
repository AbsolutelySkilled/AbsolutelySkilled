<!-- Part of the vim-neovim AbsolutelySkilled skill. Load this file when
     selecting, comparing, or configuring Neovim plugins by category. -->

# Neovim Plugin Ecosystem

Canonical plugin selections by category. All specs are written for `lazy.nvim`.
Prefer these over alternatives unless the user has an existing preference.

---

## Plugin manager

### lazy.nvim

The standard plugin manager. Handles lazy-loading, lockfiles, profiling,
and UI. Bootstrap snippet belongs in `init.lua` before any `require` calls.

```lua
{ "folke/lazy.nvim", tag = "stable" }
```

---

## LSP & completion

### mason.nvim + mason-lspconfig + nvim-lspconfig

The standard trio for LSP. Mason installs servers; mason-lspconfig bridges
mason to lspconfig; lspconfig configures each server.

```lua
{ "williamboman/mason.nvim", build = ":MasonUpdate", opts = {} },
{ "williamboman/mason-lspconfig.nvim",
  dependencies = { "williamboman/mason.nvim", "neovim/nvim-lspconfig" },
  opts = { ensure_installed = { "lua_ls", "ts_ls", "pyright" } } },
{ "neovim/nvim-lspconfig", event = { "BufReadPre", "BufNewFile" } },
```

### nvim-cmp (completion engine)

```lua
{
  "hrsh7th/nvim-cmp",
  event = "InsertEnter",
  dependencies = {
    "hrsh7th/cmp-nvim-lsp",   -- LSP source
    "hrsh7th/cmp-buffer",     -- buffer words
    "hrsh7th/cmp-path",       -- filesystem paths
    "L3MON4D3/LuaSnip",       -- snippet engine
    "saadparwaiz1/cmp_luasnip",
    "rafamadriz/friendly-snippets",
  },
}
```

### none-ls.nvim (formatters / linters via LSP)

```lua
{
  "nvimtools/none-ls.nvim",
  event = { "BufReadPre", "BufNewFile" },
  dependencies = { "nvim-lua/plenary.nvim" },
  config = function()
    local null_ls = require("null-ls")
    null_ls.setup({
      sources = {
        null_ls.builtins.formatting.prettier,
        null_ls.builtins.formatting.stylua,
        null_ls.builtins.diagnostics.eslint_d,
      },
    })
  end,
}
```

---

## Fuzzy finding

### telescope.nvim

```lua
{
  "nvim-telescope/telescope.nvim",
  cmd = "Telescope",
  dependencies = {
    "nvim-lua/plenary.nvim",
    { "nvim-telescope/telescope-fzf-native.nvim", build = "make" },
    "nvim-telescope/telescope-ui-select.nvim",
  },
}
```

Useful pickers: `find_files`, `live_grep`, `buffers`, `lsp_references`,
`lsp_document_symbols`, `git_commits`, `diagnostics`.

---

## Syntax & parsing

### nvim-treesitter

```lua
{
  "nvim-treesitter/nvim-treesitter",
  build = ":TSUpdate",
  event = { "BufReadPost", "BufNewFile" },
  dependencies = {
    "nvim-treesitter/nvim-treesitter-textobjects",
    "nvim-treesitter/nvim-treesitter-context",  -- sticky function headers
  },
}
```

---

## UI

### catppuccin (colorscheme)

```lua
{
  "catppuccin/nvim",
  name = "catppuccin",
  priority = 1000,  -- load before other plugins
  opts = { flavour = "mocha", integrations = { telescope = true, cmp = true } },
}
```

### lualine.nvim (statusline)

```lua
{
  "nvim-lualine/lualine.nvim",
  event = "VeryLazy",
  dependencies = { "nvim-tree/nvim-web-devicons" },
  opts = { options = { theme = "catppuccin", globalstatus = true } },
}
```

### bufferline.nvim (tab/buffer bar)

```lua
{
  "akinsho/bufferline.nvim",
  event = "VeryLazy",
  dependencies = "nvim-tree/nvim-web-devicons",
  opts = { options = { diagnostics = "nvim_lsp", separator_style = "slant" } },
}
```

### noice.nvim (UI overhaul - cmdline, messages, popups)

```lua
{
  "folke/noice.nvim",
  event = "VeryLazy",
  dependencies = { "MunifTanjim/nui.nvim", "rcarriga/nvim-notify" },
  opts = { lsp = { override = { ["vim.lsp.util.convert_input_to_markdown_lines"] = true } } },
}
```

---

## File navigation

### neo-tree.nvim

```lua
{
  "nvim-neo-tree/neo-tree.nvim",
  branch = "v3.x",
  cmd = "Neotree",
  keys = { { "<leader>e", "<cmd>Neotree toggle<cr>", desc = "Explorer" } },
  dependencies = { "nvim-lua/plenary.nvim", "nvim-tree/nvim-web-devicons", "MunifTanjim/nui.nvim" },
}
```

### harpoon (mark and jump between files)

```lua
{
  "ThePrimeagen/harpoon",
  branch = "harpoon2",
  dependencies = { "nvim-lua/plenary.nvim" },
  keys = {
    { "<leader>ha", function() require("harpoon"):list():add() end,    desc = "Harpoon add" },
    { "<leader>hh", function() require("harpoon").ui:toggle_quick_menu(require("harpoon"):list()) end, desc = "Harpoon menu" },
  },
}
```

---

## Git

### gitsigns.nvim (inline git blame, hunks, staging)

```lua
{
  "lewis6991/gitsigns.nvim",
  event = { "BufReadPre", "BufNewFile" },
  opts = {
    signs = { add = { text = "+" }, change = { text = "~" }, delete = { text = "_" } },
    on_attach = function(bufnr)
      local gs = package.loaded.gitsigns
      vim.keymap.set("n", "]h", gs.next_hunk, { buffer = bufnr, desc = "Next hunk" })
      vim.keymap.set("n", "[h", gs.prev_hunk, { buffer = bufnr, desc = "Prev hunk" })
      vim.keymap.set("n", "<leader>hs", gs.stage_hunk, { buffer = bufnr, desc = "Stage hunk" })
      vim.keymap.set("n", "<leader>hr", gs.reset_hunk, { buffer = bufnr, desc = "Reset hunk" })
      vim.keymap.set("n", "<leader>gb", gs.blame_line, { buffer = bufnr, desc = "Git blame" })
    end,
  },
}
```

### diffview.nvim (full diff and merge UI)

```lua
{
  "sindrets/diffview.nvim",
  cmd = { "DiffviewOpen", "DiffviewFileHistory" },
  dependencies = "nvim-lua/plenary.nvim",
}
```

---

## Editing enhancements

### nvim-autopairs

```lua
{ "windwp/nvim-autopairs", event = "InsertEnter", opts = { check_ts = true } }
```

### Comment.nvim

```lua
{ "numToStr/Comment.nvim", event = { "BufReadPost", "BufNewFile" }, opts = {} }
```

### nvim-surround

```lua
{ "kylechui/nvim-surround", event = { "BufReadPost", "BufNewFile" }, opts = {} }
```

Keymaps: `ys{motion}{char}` add, `cs{old}{new}` change, `ds{char}` delete.

### which-key.nvim (keymap hints)

```lua
{
  "folke/which-key.nvim",
  event = "VeryLazy",
  opts = { delay = 500 },
}
```

---

## Debugging

### nvim-dap + nvim-dap-ui

```lua
{
  "mfussenegger/nvim-dap",
  keys = {
    { "<leader>db", function() require("dap").toggle_breakpoint() end, desc = "Toggle breakpoint" },
    { "<leader>dc", function() require("dap").continue() end,          desc = "Continue" },
  },
},
{
  "rcarriga/nvim-dap-ui",
  dependencies = { "mfussenegger/nvim-dap", "nvim-neotest/nvim-nio" },
  config = function()
    local dap, dapui = require("dap"), require("dapui")
    dapui.setup()
    dap.listeners.after.event_initialized["dapui_config"] = function() dapui.open() end
    dap.listeners.before.event_terminated["dapui_config"] = function() dapui.close() end
  end,
},
```

---

## AI / Copilot

### copilot.lua

```lua
{
  "zbirenbaum/copilot.lua",
  cmd = "Copilot",
  event = "InsertEnter",
  opts = {
    suggestion = { enabled = false },  -- use cmp source instead
    panel = { enabled = false },
  },
},
{ "zbirenbaum/copilot-cmp", opts = {} },  -- feeds into nvim-cmp
```

### avante.nvim (cursor-style AI sidepanel)

```lua
{
  "yetone/avante.nvim",
  event = "VeryLazy",
  build = "make",
  opts = { provider = "claude", claude = { model = "claude-sonnet-4-5" } },
  dependencies = { "nvim-lua/plenary.nvim", "MunifTanjim/nui.nvim" },
}
```

---

## Terminal

### toggleterm.nvim

```lua
{
  "akinsho/toggleterm.nvim",
  keys = { { "<C-\\>", desc = "Toggle terminal" } },
  opts = { open_mapping = "<C-\\>", direction = "horizontal", size = 15 },
}
```

---

## Performance tips

- Use `priority = 1000` only on colorschemes.
- Set `lazy = true` explicitly for plugins that have no good event/cmd/ft/keys trigger.
- Run `:Lazy profile` to inspect startup time contributions.
- Disable unused built-in plugins in `lazy.nvim` `performance.rtp.disabled_plugins`.
- Use `:checkhealth` after major config changes to validate LSP and plugin state.
