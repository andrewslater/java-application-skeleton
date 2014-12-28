package com.andrewslater.skeleton.cli;


import io.airlift.command.Cli;
import io.airlift.command.Command;
import io.airlift.command.Help;
import io.airlift.command.Option;
import io.airlift.command.OptionType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

public class CommandLineInterface {
    private static final Logger LOG = LoggerFactory.getLogger(CommandLineInterface.class);

    public static void main(String[] args) {
        Cli.CliBuilder<Runnable> builder = Cli.<Runnable>builder("cli")
                .withDescription("Example command line interface")
                .withDefaultCommand(Help.class)
                .withCommands(Help.class, HelloWorldCommand.class);

        Cli<Runnable> parser = builder.build();
        parser.parse(args).run();
    }

    public static class CLICommand implements Runnable
    {
        @Option(type = OptionType.GLOBAL, name = "-v", description = "Verbose mode")
        public boolean verbose;

        public void run() {
            System.out.println(getClass().getSimpleName());
        }
    }

    @Command(name = "hello-world", description = "Says hello")
    public static class HelloWorldCommand extends CLICommand
    {
        @Option(type = OptionType.COMMAND, name = "-r", description = "Who to say hello to")
        public String recipient = "World";

        @Option(type = OptionType.COMMAND, name = "-s", description = "Salutation (Hello, Goodbye)")
        public String salutation = "Hello";

        @Option(type = OptionType.COMMAND, name = "-c", description = "Capitalize name")
        public Boolean capitalizeName;

        @Override
        public void run() {
            System.out.println(String.format("%s %s!", salutation, capitalizeName ? StringUtils.capitalize(recipient) : recipient));
        }
    }

}
