import { describe, expect, it } from "bun:test";
import * as casing from "./casing";

describe("string", () => {
  describe("toCamelCase", () => {
    it.each([
      ["foo bar", "fooBar"],
      ["hello world", "helloWorld"],
      ["foo-bar", "fooBar"],
      ["some-kebab-case", "someKebabCase"],
      ["foo_bar", "fooBar"],
      ["some_snake_case", "someSnakeCase"],
      ["foo", "foo"],
      ["FooBar", "fooBar"],
      ["foo_bar-baz", "fooBarBaz"],
      ["", ""],
    ])("%j to %j", (input, expected) => {
      expect(casing.toCamelCase(input)).toBe(expected);
    });
  });
  describe("toPascalCase", () => {
    it.each([
      ["foo bar", "FooBar"],
      ["hello world", "HelloWorld"],
      ["foo-bar", "FooBar"],
      ["foo_bar", "FooBar"],
      ["foo", "Foo"],
      ["some-kebab-case", "SomeKebabCase"],
      ["", ""],
    ])("%j to %j", (input, expected) => {
      expect(casing.toPascalCase(input)).toBe(expected);
    });
  });
  describe("toSnakeCase", () => {
    it.each([
      ["foo bar", "foo_bar"],
      ["hello world", "hello_world"],
      ["fooBar", "foo_bar"],
      ["someCamelCase", "some_camel_case"],
      ["FooBar", "foo_bar"],
      ["foo-bar", "foo_bar"],
      ["foo", "foo"],
      ["", ""],
    ])("%j to %j", (input, expected) => {
      expect(casing.toSnakeCase(input)).toBe(expected);
    });
  });
  describe("toKebabCase", () => {
    it.each([
      ["foo bar", "foo-bar"],
      ["hello world", "hello-world"],
      ["fooBar", "foo-bar"],
      ["FooBar", "foo-bar"],
      ["foo_bar", "foo-bar"],
      ["some_snake_case", "some-snake-case"],
      ["foo", "foo"],
      ["", ""],
    ])("%j to %j", (input, expected) => {
      expect(casing.toKebabCase(input)).toBe(expected);
    });
  });
  describe("toSentenceCase", () => {
    it.each([
      ["foo bar", "Foo bar"],
      ["hello world", "Hello world"],
      ["fooBar", "Foo bar"],
      ["foo_bar", "Foo bar"],
      ["foo", "Foo"],
      ["SOME UPPERCASE", "Some uppercase"],
    ])("%j to %j", (input, expected) => {
      expect(casing.toSentenceCase(input)).toBe(expected);
    });
  });
  describe("toTitleCase", () => {
    it.each([
      ["foo bar", "Foo Bar"],
      ["hello world", "Hello World"],
      ["fooBar", "Foo Bar"],
      ["foo_bar", "Foo Bar"],
      ["foo-bar", "Foo Bar"],
      ["foo", "Foo"],
      ["", ""],
    ])("%j to %j", (input, expected) => {
      expect(casing.toTitleCase(input)).toBe(expected);
    });
  });
});
