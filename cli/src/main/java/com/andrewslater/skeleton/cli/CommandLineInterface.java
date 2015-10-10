package com.andrewslater.skeleton.cli;

import io.airlift.airline.Arguments;
import io.airlift.airline.Cli;
import io.airlift.airline.Command;
import io.airlift.airline.Help;
import io.airlift.airline.Option;
import io.airlift.airline.OptionType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.util.List;

public class CommandLineInterface {
    private static final Logger LOG = LoggerFactory.getLogger(CommandLineInterface.class);

    public static void main(String[] args) {
        Cli.CliBuilder<Runnable> builder = Cli.<Runnable>builder("cli")
                .withDescription("Example command line interface")
                .withDefaultCommand(Help.class)
                .withCommands(Help.class, LoginCommand.class);

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

    @Command(name = "login", description = "Creates an API session")
    public static class LoginCommand extends CLICommand
    {
        @Arguments(description = "The email address of the user to login")
        public List<String> args;

        @Override
        public void run() {
            if (args == null || args.size() != 1) {
                System.err.println("You must provide the email address of the user you want to sign in");
                return;
            }

            System.out.print(String.format("Enter password for %s: ", args.get(0)));
            String password = new String(System.console().readPassword());
            // TODO: Sign in and return auth token
        }
    }

}
